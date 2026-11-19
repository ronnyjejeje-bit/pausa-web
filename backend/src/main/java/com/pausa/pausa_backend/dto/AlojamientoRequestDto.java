package com.pausa.pausa_backend.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AlojamientoRequestDto {

    @NotBlank(message = "El título es obligatorio")
    private String titulo;

    private String descripcion;

    @NotBlank(message = "La ciudad es obligatoria")
    private String ciudad;

    private String direccion;

    @NotNull(message = "El precio por noche es obligatorio")
    @DecimalMin(value = "0.0", inclusive = false)
    private BigDecimal precioPorNoche;

    @NotNull(message = "La capacidad máxima es obligatoria")
    @Min(value = 1)
    private Integer capacidadMaxima;

    private String imagenUrl;
}