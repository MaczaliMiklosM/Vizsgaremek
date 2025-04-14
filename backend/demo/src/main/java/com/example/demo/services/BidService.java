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
                        bid.getBidder().getId()))
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
                        bid.getBidder().getId()))
                .collect(Collectors.toList());
    }

    public void acceptBid(Integer bidId) {
        Bid bid = bidRepository.findById(bidId).orElseThrow();
        Product product = bid.getProduct();

        bid.setStatus(BidStatus.ACCEPTED);
        product.setStatus(Status.SOLD);

        // ✅ Add to collection
        Collection collection = Collection.builder()
                .user(bid.getBidder())
                .product(product)
                .build();
        collectionRepository.save(collection);

        bidRepository.save(bid);
        productRepository.save(product);

        // ✅ Notify bidder
        notificationService.sendNotification(
                bid.getBidder(),
                "Your bid of $" + bid.getAmount() + " on '" + product.getName() + "' was accepted!"
        );

        // ✅ Notify uploader (optional)
        notificationService.sendNotification(
                product.getUser(),
                "You accepted a bid of $" + bid.getAmount() + " for your product: " + product.getName()
        );
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
