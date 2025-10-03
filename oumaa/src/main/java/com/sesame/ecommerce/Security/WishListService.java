package com.sesame.ecommerce.Security;

import com.sesame.ecommerce.Models.DTO.request.WishListDto;
import com.sesame.ecommerce.Models.Product;
 import com.sesame.ecommerce.Models.WishList;
import com.sesame.ecommerce.Repositories.WishListRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
@Slf4j
public class WishListService {

    private final WishListRepository wishListRepository;
    private final ProductsService productsService;

    public List<WishList> getAllProductByUserWishListId(Long id) {
        return wishListRepository.findAllWishListById(id);
    }
    public void addProductToWishlistByUser(WishListDto wishListDto) {
        // Fetch the product using the product ID from the DTO
        Optional<Product> productOptional = productsService.getProductById(wishListDto.getProductId());

        // Check if the product is present
        if (productOptional.isPresent()) {
            Product product = productOptional.get();
            log.info("Product found for userId : " + wishListDto.getUserId());

            // Build the WishList object
            WishList wishListInstance = WishList.builder()
                    .userId(wishListDto.getUserId())
                    .product(product)
                    .build();

            // Save the WishList to the repository
            wishListRepository.save(wishListInstance);
            log.info("Product was added to wishlist successfully");
        } else {
            log.error("Product with ID " + wishListDto.getProductId() +
                    " not found for userId " + wishListDto.getUserId());
            throw new RuntimeException("Product not found");
        }
    }
}