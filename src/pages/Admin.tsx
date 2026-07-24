import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

type Historico = {
  id: number
  codigo: string
  nome: string
  data_hora: string
}

export default function Admin() {
  const navigate = useNavigate()
  const [historico, setHistorico] = useState<Historico[]>([])

  useEffect(() => {
    carregarHistorico()
  }, [])

  async function carregarHistorico() {
    const { data } = await supabase
      .from('historico_pesquisas')
      .select('*')
      .order('data_hora', { ascending: false })

    if (data) {
      setHistorico(data)
    }
  }

  function exportarExcel() {
    const dados = historico.map((item) => {
      const data = new Date(item.data_hora)

      return {
        Código: item.codigo,
        Nome: item.nome,
        Data: data.toLocaleDateString('pt-PT'),
        Hora: data.toLocaleTimeString('pt-PT'),
      }
    })

    const worksheet = XLSX.utils.json_to_sheet(dados)
    const workbook = XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Histórico')

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    })

    const ficheiro = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })

    saveAs(ficheiro, 'Historico_Pesquisas.xlsx')
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 5 }}>
        <Paper sx={{ p: 4 }} elevation={4}>
          <Typography variant="h4" gutterBottom>
            Histórico de Pesquisas
          </Typography>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>Código</b></TableCell>
                <TableCell><b>Nome</b></TableCell>
                <TableCell><b>Data</b></TableCell>
                <TableCell><b>Hora</b></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {historico.map((item) => {
                const data = new Date(item.data_hora)

                return (
                  <TableRow key={item.id}>
                    <TableCell>{item.codigo}</TableCell>
                    <TableCell>{item.nome}</TableCell>
                    <TableCell>{data.toLocaleDateString('pt-PT')}</TableCell>
                    <TableCell>{data.toLocaleTimeString('pt-PT')}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>

          <Box
            sx={{
              mt: 4,
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Button
              variant="contained"
              onClick={() => navigate('/')}
            >
              Voltar
            </Button>

            <Button
              variant="contained"
              color="success"
              onClick={exportarExcel}
            >
              Exportar para Excel
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}