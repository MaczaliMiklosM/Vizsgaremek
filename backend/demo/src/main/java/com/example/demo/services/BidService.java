package com.example.demo.services;

import com.example.demo.dto.bid.BidDTO;
import com.example.demo.enums.BidStatus;
import com.example.demo.enums.Status;
import com.example.demo.model.Bid;
import com.example.demo.model.Collection;
import com.example.demo.model.Product;
import com.example.demo.model.User;
import com.example.demo.repository.BidRepository;
import com.example.demo.repository.CollectionRepository;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BidService {

    private final BidRepository bidRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final CollectionRepository collectionRepository;
    private final NotificationService notificationService;

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

        // ✅ Notify the uploader
        User uploader = product.getUser();
        notificationService.sendNotification(
                uploader,
                "You received a new bid of $" + amount + " on your product: " + product.getName()
        );

        return bidRepository.save(bid);
    }

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

    public void acceptBid(Integer bidId) {
        Bid acceptedBid = bidRepository.findById(bidId)
                .orElseThrow(() -> new RuntimeException("Bid not found"));

        Product product = acceptedBid.getProduct();

        // ✅ Elfogadott ajánlat státusz beállítása
        acceptedBid.setStatus(BidStatus.ACCEPTED);
        product.setStatus(Status.SOLD);
        bidRepository.save(acceptedBid);

        // ✅ Hozzáadás a kollekcióhoz
        Collection collection = Collection.builder()
                .user(acceptedBid.getBidder())
                .product(product)
                .build();
        collectionRepository.save(collection);

        // ✅ Az összes többi ajánlat erre a termékre: REJECTED
        List<Bid> otherBids = bidRepository.findByProductId(product.getId());
        for (Bid other : otherBids) {
            if (!other.getId().equals(bidId)) {
                other.setStatus(BidStatus.REJECTED);
            }
        }
        bidRepository.saveAll(otherBids);

        // ✅ Értesítések
        notificationService.sendNotification(
                acceptedBid.getBidder(),
                "Your bid has been accepted for product: " + product.getName() + " ($" + acceptedBid.getAmount() + ")"
        );

        for (Bid other : otherBids) {
            if (!other.getId().equals(bidId)) {
                notificationService.sendNotification(
                        other.getBidder(),
                        "Your bid has been rejected for product: " + product.getName()
                );
            }
        }
    }

    public void rejectBid(Integer bidId) {
        Bid bid = bidRepository.findById(bidId).orElseThrow();
        bid.setStatus(BidStatus.REJECTED);
        bidRepository.save(bid);

        // ✅ Notify bidder
        notificationService.sendNotification(
                bid.getBidder(),
                "Your bid of $" + bid.getAmount() + " on '" + bid.getProduct().getName() + "' was rejected."
        );
    }

    public List<Bid> findByUserId(Integer userId) {
        return bidRepository.findByBidderId(userId);
    }
}
