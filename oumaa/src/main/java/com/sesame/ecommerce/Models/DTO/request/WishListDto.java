package com.sesame.ecommerce.Models.DTO.request;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class WishListDto {
private Long userId;
private Long ProductId;

}
