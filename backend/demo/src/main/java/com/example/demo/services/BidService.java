package com.example.demo.services;

import com.example.demo.dto.bid.BidDTO;
import com.example.demo.enums.BidStatus;
import com.example.demo.enums.OrderStatus;
import com.example.demo.enums.Status;
import com.example.demo.model.*;
import com.example.demo.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BidService {
    private final OrderHeaderRepository orderHeaderRepository;
    private final OrderBodyRepository orderBodyRepository;
    private final BidRepository bidRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final CollectionRepository collectionRepository;
    private final NotificationService notificationService;
    private final WishlistRepository wishlistRepository;

    /**
     * Licit létrehozása egy adott termékre és felhasználóhoz.
     * @param productId a termék azonosítója
     * @param userId a licitáló felhasználó azonosítója
     * @param amount a licit összege
     * @return a létrehozott Bid objektum
     * @throws Exception ha nem valid a termék, user, vagy ajánlat
     */
    public Bid placeBid(Integer productId, Integer userId, Double amount) throws Exception {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new Exception("Product not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new Exception("User not found"));

        if (bidRepository.existsByProductIdAndBidderIdAndStatus(productId, userId, BidStatus.PENDING)) {
            throw new Exception("You already have an active bid for this product.");
        }

        if (product.getStatus() == Status.SOLD) {
            throw new Exception("Product already sold");
        }

        double minimumBid = product.getPrice() / 2;
        if (amount < minimumBid) {
            throw new Exception("Bid must be at least half of the product price ($" + minimumBid + ")");
        }

        if (amount >= product.getPrice()) {
            throw new Exception("Offer is equal or greater than price. You should buy it directly.");
        }

        Bid bid = new Bid();
        bid.setProduct(product);
        bid.setBidder(user);
        bid.setAmount(amount);
        bid.setTime(LocalDateTime.now());
        bid.setStatus(BidStatus.PENDING);

        // Értesítés a feltöltőnek
        User uploader = product.getUser();
        notificationService.sendNotification(
                uploader,
                "You received a new bid of $" + amount + " on your product: " + product.getName()
        );

        return bidRepository.save(bid);
    }

    /**
     * Összes ajánlat lekérése egy adott termékre.
     * @param productId a termék azonosítója
     * @return ajánlat DTO-k listája
     */
    public List<BidDTO> findByProductId(Integer productId) {
        return bidRepository.findByProductId(productId).stream()
                .map(bid -> new BidDTO(
                        bid.getId(),
                        bid.getAmount(),
                        bid.getTime(),
                        bid.getStatus().name(),
                        bid.getProduct().getId(),
                        bid.getBidder().getId(),
                        bid.getProduct().getName(),
                        bid.getBidder().getFull_name()
                ))
                .collect(Collectors.toList());
    }

    /**
     * Feltöltő által kapott ajánlatok lekérése.
     * @param uploaderId a feltöltő felhasználó azonosítója
     * @return DTO lista az érkezett ajánlatokról
     */
    public List<BidDTO> findReceivedBids(Integer uploaderId) {
        return bidRepository.findByProduct_User_Id(uploaderId).stream()
                .map(bid -> new BidDTO(
                        bid.getId(),
                        bid.getAmount(),
                        bid.getTime(),
                        bid.getStatus().name(),
                        bid.getProduct().getId(),
                        bid.getBidder().getId(),
                        bid.getProduct().getName(),
                        bid.getBidder().getFull_name()
                ))
                .collect(Collectors.toList());
    }

    /**
     * Ajánlat elfogadása, termék eladása, order létrehozása.
     * @param bidId az elfogadandó ajánlat azonosítója
     */
    @Transactional
    public void acceptBid(Integer bidId) {
        Bid acceptedBid = bidRepository.findById(bidId)
                .orElseThrow(() -> new RuntimeException("Bid not found"));

        Product product = acceptedBid.getProduct();
        User buyer = acceptedBid.getBidder();
        User seller = product.getUser();  // Feltöltő

        acceptedBid.setStatus(BidStatus.ACCEPTED);
        product.setStatus(Status.SOLD);
        bidRepository.save(acceptedBid);

        Collection collection = Collection.builder()
                .user(buyer)
                .product(product)
                .build();
        collectionRepository.save(collection);

        List<Bid> otherBids = bidRepository.findByProductId(product.getId());
        for (Bid other : otherBids) {
            if (!other.getId().equals(bidId)) {
                other.setStatus(BidStatus.REJECTED);
            }
        }
        bidRepository.saveAll(otherBids);

        List<Wishlist> wishlists = wishlistRepository.findByProductId(product.getId());
        for (Wishlist w : wishlists) {
            if (w.getUser().getId() != buyer.getId()) {
                notificationService.sendNotification(
                        w.getUser(),
                        "The item on your wishlist has been sold. Name: " + product.getName()
                );
            }
        }
        wishlistRepository.deleteByProductId(product.getId());

        // Rendelés létrehozása
        String address = buyer.getAddress();
        if (address != null && !address.trim().isEmpty()) {
            OrderHeader order = OrderHeader.builder()
                    .user(buyer)
                    .shippingAddress(address)
                    .status(OrderStatus.PROCESSING)
                    .totalAmount(acceptedBid.getAmount().intValue())
                    .items(new ArrayList<>())
                    .build();
            order = orderHeaderRepository.save(order);

            OrderBody body = OrderBody.builder()
                    .order(order)
                    .product(product)
                    .unitPrice(acceptedBid.getAmount().intValue())
                    .quantity(1)
                    .build();
            orderBodyRepository.save(body);
            order.getItems().add(body);
            orderHeaderRepository.save(order);
        }

        // Értesítések a feleknek
        notificationService.sendNotification(
                buyer,
                "Your bid has been accepted for product: " + product.getName() + " ($" + acceptedBid.getAmount() + ")"
        );

        for (Bid other : otherBids) {
            if (!other.getId().equals(bidId)) {
                notificationService.sendNotification(
                        other.getBidder(),
                        "Someone else has won the bid for this product: " + product.getName()
                );
            }
        }

        notificationService.sendNotification(
                seller,
                "Congratulations! Your product \"" + product.getName() + "\" has been sold to " + buyer.getFull_name() + " via bid."
        );
    }

    /**
     * Ajánlat elutasítása.
     * @param bidId az elutasítandó ajánlat azonosítója
     */
    public void rejectBid(Integer bidId) {
        Bid bid = bidRepository.findById(bidId).orElseThrow();
        bid.setStatus(BidStatus.REJECTED);
        bidRepository.save(bid);

        // Értesítés a felhasználónak
        notificationService.sendNotification(
                bid.getBidder(),
                "Your bid of $" + bid.getAmount() + " on '" + bid.getProduct().getName() + "' was rejected."
        );
    }

    /**
     * Egy felhasználó összes ajánlatának lekérdezése.
     * @param userId a felhasználó azonosítója
     * @return ajánlatok listája
     */
    public List<Bid> findByUserId(Integer userId) {
        return bidRepository.findByBidderId(userId);
    }
}
