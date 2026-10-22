package com.pausa.pausa_backend.repository;

import com.pausa.pausa_backend.model.Alojamiento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface AlojamientoRepository extends JpaRepository<Alojamiento, Long> {

    // Buscar alojamientos por ciudad/destino
    List<Alojamiento> findByCiudadContainingIgnoreCaseAndActivoTrue(String ciudad);

    // Filtrar alojamientos por precio máximo y capacidad mínima
    List<Alojamiento> findByPrecioPorNocheLessThanEqualAndCapacidadMaximaGreaterThanEqualAndActivoTrue(
            BigDecimal precioMax, Integer capacidadMin);

    // Obtener todos los alojamientos activos
    List<Alojamiento> findByActivoTrue();
}