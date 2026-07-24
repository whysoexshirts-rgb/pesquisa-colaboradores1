import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from '@mui/material'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [codigo, setCodigo] = useState('')
  const navigate = useNavigate()

  async function pesquisar() {
    let valor = codigo.trim().toUpperCase()

    if (valor.startsWith('SC')) {
      valor = valor.substring(2)
    }

    if (!/^\d{5}$/.test(valor)) {
      alert('O código deve ser SC seguido de 5 algarismos.')
      return
    }

    const codigoCompleto = `SC${valor}`

const { data, error } = await supabase
  .from('Colaboradores')
  .select('*')
  .eq('Codigo', codigoCompleto)

console.log('Código pesquisado:', codigoCompleto)
console.log('Data:', data)
console.log('Erro:', error)
console.log('Código enviado:', `"${codigoCompleto}"`)

if (error) {
  alert(error.message)
  return
}

if (!data || data.length === 0) {
  alert('Colaborador Inexistente')
  return
}

const colaborador = data[0]

    const { error: erroHistorico } = await supabase
      .from('historico_pesquisas')
      .insert({
        codigo: colaborador.Codigo,
        nome: colaborador.Nome,
        data_hora: new Date().toISOString(),
      })

    if (erroHistorico) {
      alert('Erro ao gravar o histórico.')
      return
    }

    navigate(`/colaborador/${colaborador.Codigo}`)
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper sx={{ p: 4, width: '100%' }} elevation={4}>
          <Typography variant="h4" align="center" gutterBottom>
            SC Finder
          </Typography>

          <Typography align="center" sx={{ mb: 3 }}>
            Introduza o código do colaborador
          </Typography>

          <TextField
            fullWidth
            label="Código"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value.toUpperCase())}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                pesquisar()
              }
            }}
          />

          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
            onClick={pesquisar}
          >
            Pesquisar
          </Button>
        </Paper>
      </Box>
    </Container>
  )
}