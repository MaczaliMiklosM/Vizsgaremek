package com.example.demo.controller;

import com.example.demo.dto.bid.BidDTO;  // A BidDTO importálása
import com.example.demo.dto.bid.BidRequestDTO;
import com.example.demo.model.Bid;
import com.example.demo.repository.BidRepository;
import com.example.demo.services.BidService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import com.example.demo.services.JWTUtils;
import com.example.demo.services.UserDetailService;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/bids")
@RequiredArgsConstructor
public class BidController {
    @Autowired
    private JWTUtils jwtUtils;
    private final BidService bidService;
    @Autowired
    private BidRepository bidRepository;

    @PostMapping("/place")
    public ResponseEntity<?> placeBid(@RequestBody BidRequestDTO bidRequest) {
        try {
            Bid bid = bidService.placeBid(
                    bidRequest.getProductId(),
                    bidRequest.getUserId(),
                    bidRequest.getAmount()
            );
            BidDTO bidDTO = new BidDTO(
                    bid.getId(),
                    bid.getAmount(),
                    bid.getTime(),
                    bid.getStatus().name(),
                    bid.getProduct().getId(),
                    bid.getBidder().getId()
            );
            return ResponseEntity.ok(bidDTO);
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Error placing bid: " + e.getMessage());
        }
    }




    //@PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<BidDTO>> getBidsForProduct(@PathVariable Integer productId) {
        List<BidDTO> bidDTOs = bidService.findByProductId(productId).stream()
                .map(bid -> new BidDTO(bid.getId(), bid.getAmount(), bid.getTime(), bid.getStatus(), bid.getProductId(), bid.getUserId()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(bidDTOs);
    }

   // @PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
    @PostMapping("/accept/{bidId}")
    public ResponseEntity<?> acceptBid(@PathVariable Integer bidId) {
        bidService.acceptBid(bidId);
        return ResponseEntity.ok("Bid accepted and product marked as SOLD.");
    }

    //@PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
    @PostMapping("/reject/{bidId}")
    public ResponseEntity<?> rejectBid(@PathVariable Integer bidId) {
        bidService.rejectBid(bidId);
        return ResponseEntity.ok("Bid rejected.");
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BidDTO>> getBidsByUserId(@PathVariable Integer userId) {
        List<BidDTO> bidDTOs = bidService.findByUserId(userId).stream()
                .map(bid -> new BidDTO(bid.getId(), bid.getAmount(), bid.getTime(),
                        bid.getStatus().name(), bid.getProduct().getId(), bid.getBidder().getId()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(bidDTOs);
    }


    @GetMapping("/received/{uploaderId}")
    public ResponseEntity<List<BidDTO>> getReceivedBids(@PathVariable Integer uploaderId) {
        List<BidDTO> bidDTOs = bidService.findReceivedBids(uploaderId);
        return ResponseEntity.ok(bidDTOs);
    }



}
