package com.pausa.pausa_backend.dto;

import lombok.*;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AlojamientoResponseDto {

    private Long id;
    private String titulo;
    private String descripcion;
    private String ciudad;
    private String direccion;
    private BigDecimal precioPorNoche;
    private Integer capacidadMaxima;
    private String imagenUrl;
    private Boolean activo;
}