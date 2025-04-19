package com.example.demo.controller;
import com.example.demo.dto.bid.BidDTO;
import com.example.demo.dto.bid.BidRequestDTO;
import com.example.demo.model.Bid;
import com.example.demo.services.BidService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/bids")
@RequiredArgsConstructor
public class BidController {

    private final BidService bidService;

    /**
     * Új licit leadása egy adott termékre.
     *
     * @param bidRequest a licit részleteit tartalmazó DTO (termék, felhasználó, összeg)
     * @return a létrehozott licit DTO formában vagy hibaüzenet
     */
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

    /**
     * Licitek lekérdezése egy adott termékre.
     *
     * @param productId a termék azonosítója
     * @return a hozzá tartozó licitek listája DTO formában
     */
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<BidDTO>> getBidsForProduct(@PathVariable Integer productId) {
        List<BidDTO> bidDTOs = bidService.findByProductId(productId).stream()
                .map(bid -> new BidDTO(
                        bid.getId(),
                        bid.getAmount(),
                        bid.getTime(),
                        bid.getStatus(),
                        bid.getProductId(),
                        bid.getUserId()
                ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(bidDTOs);
    }

    /**
     * Licit elfogadása. A termék státusza ilyenkor "SOLD"-ra vált.
     * Csak USER vagy ADMIN szerepkörrel elérhető.
     *
     * @param bidId a licit azonosítója
     * @return visszajelzés a műveletről
     */
    @PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
    @PostMapping("/accept/{bidId}")
    public ResponseEntity<?> acceptBid(@PathVariable Integer bidId) {
        bidService.acceptBid(bidId);
        return ResponseEntity.ok("Bid accepted and product marked as SOLD.");
    }

    /**
     * Licit elutasítása.
     * Csak USER vagy ADMIN szerepkörrel elérhető.
     *
     * @param bidId a licit azonosítója
     * @return visszajelzés a műveletről
     */
    @PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
    @PostMapping("/reject/{bidId}")
    public ResponseEntity<?> rejectBid(@PathVariable Integer bidId) {
        bidService.rejectBid(bidId);
        return ResponseEntity.ok("Bid rejected.");
    }

    /**
     * Licitek lekérdezése egy adott felhasználó által.
     * Ezek a licitek, amiket a felhasználó leadott.
     *
     * @param userId a felhasználó azonosítója
     * @return a saját licitjeinek listája
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BidDTO>> getBidsByUserId(@PathVariable Integer userId) {
        List<BidDTO> bidDTOs = bidService.findByUserId(userId).stream()
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
        return ResponseEntity.ok(bidDTOs);
    }

    /**
     * A feltöltő által kapott licitek lekérdezése.
     * Ezek azok a licitek, amelyeket mások tettek a felhasználó termékeire.
     *
     * @param uploaderId a terméket feltöltő felhasználó ID-ja
     * @return a beérkezett licitek listája DTO-ként
     */
    @GetMapping("/received/{uploaderId}")
    public ResponseEntity<List<BidDTO>> getReceivedBids(@PathVariable Integer uploaderId) {
        List<BidDTO> bidDTOs = bidService.findReceivedBids(uploaderId);
        return ResponseEntity.ok(bidDTOs);
    }
}
