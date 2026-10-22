package com.pausa.pausa_backend.service;

import com.pausa.pausa_backend.dto.AlojamientoRequestDto;
import com.pausa.pausa_backend.dto.AlojamientoResponseDto;
import com.pausa.pausa_backend.model.Alojamiento;
import com.pausa.pausa_backend.repository.AlojamientoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AlojamientoService {

    private final AlojamientoRepository alojamientoRepository;

    @Transactional(readOnly = true)
    public List<AlojamientoResponseDto> obtenerTodos() {
        return alojamientoRepository.findByActivoTrue()
                .stream()
                .map(this::mapToResponseDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public AlojamientoResponseDto obtenerPorId(Long id) {
        Alojamiento alojamiento = alojamientoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Alojamiento no encontrado con id: " + id));
        return mapToResponseDto(alojamiento);
    }

    @Transactional(readOnly = true)
    public List<AlojamientoResponseDto> buscarPorCiudad(String ciudad) {
        return alojamientoRepository.findByCiudadContainingIgnoreCaseAndActivoTrue(ciudad)
                .stream()
                .map(this::mapToResponseDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AlojamientoResponseDto> filtrarPorPrecioYCapacidad(BigDecimal precioMax, Integer capacidadMin) {
        return alojamientoRepository
                .findByPrecioPorNocheLessThanEqualAndCapacidadMaximaGreaterThanEqualAndActivoTrue(precioMax, capacidadMin)
                .stream()
                .map(this::mapToResponseDto)
                .toList();
    }

    @Transactional
    public AlojamientoResponseDto crear(AlojamientoRequestDto request) {
        Alojamiento alojamiento = Alojamiento.builder()
                .titulo(request.getTitulo())
                .descripcion(request.getDescripcion())
                .ciudad(request.getCiudad())
                .direccion(request.getDireccion())
                .precioPorNoche(request.getPrecioPorNoche())
                .capacidadMaxima(request.getCapacidadMaxima())
                .imagenUrl(request.getImagenUrl())
                .activo(true)
                .build();

        Alojamiento guardado = alojamientoRepository.save(alojamiento);
        return mapToResponseDto(guardado);
    }

    private AlojamientoResponseDto mapToResponseDto(Alojamiento entity) {
        return AlojamientoResponseDto.builder()
                .id(entity.getId())
                .titulo(entity.getTitulo())
                .descripcion(entity.getDescripcion())
                .ciudad(entity.getCiudad())
                .direccion(entity.getDireccion())
                .precioPorNoche(entity.getPrecioPorNoche())
                .capacidadMaxima(entity.getCapacidadMaxima())
                .imagenUrl(entity.getImagenUrl())
                .activo(entity.getActivo())
                .build();
    }
}