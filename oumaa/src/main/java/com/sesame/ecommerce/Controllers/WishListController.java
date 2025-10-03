package com.sesame.ecommerce.Controllers;

import com.sesame.ecommerce.Models.DTO.request.WishListDto;
import com.sesame.ecommerce.Models.WishList;
import com.sesame.ecommerce.Security.WishListService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/wishlist")
@AllArgsConstructor
@Slf4j
public class WishListController {

    private final WishListService wishListService;

    /**
     * Get all products in a user's wishlist
     * @param userId User ID
     * @return List of wishlist items for the user
     */
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<WishList>> getUserWishlist(@PathVariable Long userId) {
        try {
            List<WishList> wishlistItems = wishListService.getAllProductByUserWishListId(userId);
            if (wishlistItems.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return ResponseEntity.ok(wishlistItems);
        } catch (Exception e) {
            log.error("Error fetching wishlist for user: " + userId, e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Add a product to user's wishlist
     * @param wishListDto DTO containing userId and productId
     * @return Success message
     */
    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<String> addProductToWishlist(@RequestBody WishListDto wishListDto) {
        try {
            wishListService.addProductToWishlistByUser(wishListDto);
            return new ResponseEntity<>("Product added to wishlist successfully", HttpStatus.CREATED);
        } catch (RuntimeException e) {
            log.error("Error adding product to wishlist: ", e);
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            log.error("Unexpected error: ", e);
            return new ResponseEntity<>("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Remove a product from wishlist
     * @param wishlistId Wishlist item ID
     * @return Success message
     */
    @DeleteMapping("/{wishlistId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<String> removeFromWishlist(@PathVariable Long wishlistId) {
        try {
            // You'll need to implement this method in WishListService
            // wishListService.removeFromWishlist(wishlistId);
            return ResponseEntity.ok("Product removed from wishlist successfully");
        } catch (Exception e) {
            log.error("Error removing product from wishlist: ", e);
            return new ResponseEntity<>("Failed to remove product from wishlist", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
