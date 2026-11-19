package com.pausa.pausa_backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "alojamientos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Alojamiento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El título es obligatorio")
    @Column(nullable = false, length = 150)
    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @NotBlank(message = "La ciudad es obligatoria")
    @Column(nullable = false, length = 100)
    private String ciudad;

    private String direccion;

    @NotNull(message = "El precio por noche es obligatorio")
    @DecimalMin(value = "0.0", inclusive = false)
    @Column(name = "precio_por_noche", nullable = false, precision = 10, scale = 2)
    private BigDecimal precioPorNoche;

    @NotNull(message = "La capacidad máxima es obligatoria")
    @Min(value = 1)
    @Column(name = "capacidad_maxima", nullable = false)
    private Integer capacidadMaxima;

    @Column(name = "imagen_url", length = 500)
    private String imagenUrl;

    @Builder.Default
    @Column(nullable = false)
    private Boolean activo = true;

    @Column(name = "fecha_creacion", updatable = false)
    private LocalDateTime fechaCreacion;

    @PrePersist
    protected void onCreate() {
        this.fechaCreacion = LocalDateTime.now();
    }
}