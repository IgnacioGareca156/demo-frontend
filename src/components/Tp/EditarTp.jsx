import React, { useContext, useEffect, useRef, useState } from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { InputLabel, MenuItem, Select, Box, IconButton, CircularProgress } from '@mui/material'
import useFetch from '../../services/hooks/useFetch'
import useForm from '../../services/hooks/useForm'
import { directus } from '../../services/directus'
import { updateFile } from '@directus/sdk'
import EditSharpIcon from '@mui/icons-material/EditSharp';
import { GlobalContext } from '../../services/global.context'

export default function EditarTp({ tp_id, aulas, materias }) {
    const [open, setOpen] = useState(false)
    // const { fetchData: updateTp } = useFetch('Tp', 'UPDATE_TP')
    // const { state: stateTp, fetchData: getTp } = useFetch('Tp', 'GET_TP')
    const sortedAulas = aulas?.sort((a, b) => a.aula_nombre.localeCompare(b.aula_nombre))
    const [selectedFile, setSelectedFile] = useState(null)
    const { state } = useContext(GlobalContext)
    const { getById, update } = useFetch()
    const [successMessage, setSuccessMessage] = useState('')

    const validate = (form) => {
        let errors = {}
        // Puedes agregar validaciones si es necesario
        return errors
    }

    // Para manejar el cambio en la selección del archivo
    const handleFileChange = (event) => {
        const file = event.target.files[0]
        setSelectedFile(file)
    }

    const enviarArchivo = async () => {
        if (selectedFile) {
            try {
                // Crea un objeto FormData y agrega el archivo a él
                const formData = new FormData()
                formData.append('folder', '0fcf39b0-e4cb-40b4-9b61-e38975c870c0')
                formData.append('storage', 'local')
                formData.append('filename_download', selectedFile.name)
                formData.append('title', form.tp_titulo)
                formData.append('type', selectedFile.type)
                formData.append('file', selectedFile)

                // Sube el archivo a Directus
                const response = await directus.request(updateFile(form.tp_file, formData))

                // Obtiene el ID del archivo desde la respuesta y lo asigna al formulario para la cartilla
                form.tp_file = response.id
            } catch (error) {
                console.log(error)
            } finally {
                setSelectedFile(null)
            }
        }
    }

    const enviarDatos = async () => {
        try {
            await enviarArchivo()

            // Realiza la solicitud UPDATE con el formulario actualizado
            await update(tp_id, form, 'Tp', 'UPDATE_TP', {})
            setSuccessMessage('¡Operación Existosa!')
        } catch (error) {
            console.log('Error en la consulta', error)
        } finally {
            setTimeout(() => {
                if (successMessage !== '') {
                    handleClose(); // Cerrar el diálogo después de 2 segundos
                }
            }, 4000);
        }
    }

    const {
        form,
        setForm,
        errors,
        loadingForm,
        handleBlur,
        handleChange,
        handleSubmit,
    } = useForm(validate, {
        tp_titulo: '',
        tp_descripcion: '',
        tp_file: '',
        tp_aula: '',
        tp_materia: '',
    }, enviarDatos)

    const handleClickOpen = () => {
        setOpen(true)

        //solicitud para obtener los datos de la tarea con el ID tarea_id
        getById(tp_id, 'Tp', 'GET_TP', {})

    }

    const handleClose = () => {
        setOpen(false)
        setSuccessMessage(''); // Limpiar mensaje de éxito
    }


    useEffect(() => {
        setForm({
            tp_titulo: state.getTp?.tp_titulo || '',
            tp_descripcion: state.getTp?.tp_descripcion || '',
            tp_file: state.getTp?.tp_file || '',
            tp_aula: state.getTp?.tp_aula || '',
            tp_materia: state.getTp?.tp_materia || '',
        })
    }, [state.getTp])

    return (
        <React.Fragment>
            <IconButton color='' aria-label='editar' size='large' onClick={handleClickOpen}>
                <EditSharpIcon />
            </IconButton>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: handleSubmit
                }}
            >
                <DialogTitle>Editar Trabajo Práctico</DialogTitle>
                {successMessage ? ( // Mostrar mensaje de éxito si existe
                    <DialogContent>
                        <DialogContentText>
                            {successMessage}
                        </DialogContentText>
                        <DialogActions sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Button color='secondary' onClick={handleClose}>Cerrar</Button>
                        </DialogActions>
                    </DialogContent>
                ) : (
                    <>
                        <DialogContent>
                            <DialogContentText>
                                Edite la información del Trabajo Práctico
                            </DialogContentText>
                            <TextField
                                autoFocus
                                required
                                margin="dense"
                                id="tp_titulo"
                                name="tp_titulo"
                                label="Titulo"
                                type="text"
                                fullWidth
                                variant="standard"
                                value={form.tp_titulo}
                                onChange={handleChange}
                            />

                            <TextField
                                id="tp_descripcion"
                                name="tp_descripcion"
                                label="Descripción *"
                                multiline
                                rows={5}
                                variant="standard"
                                fullWidth
                                value={form.tp_descripcion}
                                onChange={handleChange}
                            />

                            <TextField
                                
                                margin="dense"
                                id="tp_file"
                                name="tp_file"
                                label="Archivo"
                                type="file"
                                fullWidth
                                variant="standard"
                                onChange={handleFileChange}
                            />
                            <Box sx={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
                                <Box sx={{ width: '50%' }}>
                                    <InputLabel id="materia-label" sx={{ mt: 2 }}>
                                        Aula
                                    </InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        name="tp_aula"
                                        value={form?.tp_aula}
                                        label="Aula"
                                        onChange={handleChange}
                                        sx={{ width: '100%' }}
                                    >

                                        {sortedAulas?.map((aula) => (
                                            <MenuItem value={aula.aula_id} key={aula.aula_id}>{aula.aula_nombre}</MenuItem>
                                        ))}
                                    </Select>
                                </Box>

                                <Box sx={{ width: '50%' }}>
                                    <InputLabel id="materia-label" sx={{ mt: 2 }}>
                                        Materia
                                    </InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        name="tp_materia"
                                        value={form.tp_materia}
                                        label="Materia"
                                        onChange={handleChange}
                                        sx={{ width: '100%' }}
                                    >

                                        {materias?.map((materia) => (
                                            <MenuItem value={materia.materia_id} key={materia.materia_id}>{materia.materia_nombre}</MenuItem>
                                        ))}
                                    </Select>
                                </Box>
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            {loadingForm ? ( // Mostrar CircularProgress si loading es true
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                                    <CircularProgress />
                                </div>
                            ) : (
                                <>
                                    <Button onClick={handleClose}>Cancelar</Button>
                                    <Button type="submit">Guardar Cambios</Button>
                                </>
                            )}
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </React.Fragment>
    )
}
