package com.pausa.pausa_backend.service;

import com.pausa.pausa_backend.exception.RecursoNoEncontradoException;
import com.pausa.pausa_backend.repository.AlojamientoRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AlojamientoServiceTest {

    @Mock
    private AlojamientoRepository repository;

    @InjectMocks
    private AlojamientoService service;

    @Test
    void obtenerPorIdLanzaExcepcionSiNoExiste() {
        when(repository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(RecursoNoEncontradoException.class, () -> service.obtenerPorId(999L));
    }
}
