package com.pausa.pausa_backend.controller;

import com.pausa.pausa_backend.exception.GlobalExceptionHandler;
import com.pausa.pausa_backend.exception.RecursoNoEncontradoException;
import com.pausa.pausa_backend.service.AlojamientoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class AlojamientoControllerTest {

    private MockMvc mockMvc;
    private AlojamientoService service;

    @BeforeEach
    void setUp() {
        service = Mockito.mock(AlojamientoService.class);
        mockMvc = MockMvcBuilders.standaloneSetup(new AlojamientoController(service))
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void idInexistenteResponde404ConMensaje() throws Exception {
        when(service.obtenerPorId(999L))
                .thenThrow(new RecursoNoEncontradoException("Alojamiento no encontrado con id: 999"));

        mockMvc.perform(get("/api/v1/alojamientos/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").value("Alojamiento no encontrado con id: 999"));
    }
}
