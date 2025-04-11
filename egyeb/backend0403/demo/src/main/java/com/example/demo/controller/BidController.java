package com.example.demo.controller;

import com.example.demo.product.model.Bid;
import com.example.demo.product.services.BidService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bids")
@Tag(name = "Bids")
public class BidController {

    private final BidService bidService;

    public BidController(BidService bidService) {
        this.bidService = bidService;
    }

    @GetMapping("/product/{productId}")
    public List<Bid> getBidsByProduct(@PathVariable Integer productId) {
        return bidService.getBidsByProduct(productId);
    }

    @GetMapping("/user/{userId}")
    public List<Bid> getBidsByUser(@PathVariable Integer userId) {
        return bidService.getBidsByUser(userId);
    }

    @PostMapping
    public Bid placeBid(@RequestBody Bid bid) {
        return bidService.placeBid(bid);
    }

    @DeleteMapping("/{bidId}")
    public void deleteBid(@PathVariable Integer bidId) {
        bidService.deleteBid(bidId);
    }
}

