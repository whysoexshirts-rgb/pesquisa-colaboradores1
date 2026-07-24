import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
} from '@mui/material'
import { supabase } from '../lib/supabase'

export default function Colaborador() {
  const { codigo } = useParams()
  const navigate = useNavigate()

  const [nome, setNome] = useState('')
  const [historico, setHistorico] = useState<any[]>([])

  useEffect(() => {
    async function carregar() {
      if (!codigo) return

      const { data: colaborador } = await supabase
        .from('Colaboradores')
        .select('*')
        .eq('Codigo', codigo)
        .single()

      if (colaborador) {
        setNome(colaborador.Nome)
      }

      const { data: pesquisas } = await supabase
        .from('historico_pesquisas')
        .select('*')
        .eq('codigo', codigo)
        .order('data_hora', { ascending: false })

      if (pesquisas) {
        setHistorico(pesquisas)
      }
    }

    carregar()
  }, [codigo])

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
          <Typography variant="h4" align="center">
            {codigo}
          </Typography>

          <Typography
            variant="h5"
            align="center"
            sx={{ mt: 2, mb: 4 }}
          >
            {nome}
          </Typography>

          {historico.map((item) => (
            <Typography
              key={item.id}
              align="center"
              sx={{ mb: 1 }}
            >
              {new Date(item.data_hora).toLocaleString('pt-PT')}
            </Typography>
          ))}

          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 4 }}
            onClick={() => navigate('/')}
          >
            Nova Pesquisa
          </Button>
        </Paper>
      </Box>
    </Container>
  )
}