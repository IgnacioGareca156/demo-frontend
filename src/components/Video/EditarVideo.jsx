import React, { useContext, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { InputLabel, MenuItem, Select, Box, IconButton, CircularProgress } from '@mui/material';
import useFetch from '../../services/hooks/useFetch';
import useForm from '../../services/hooks/useForm';
import { GlobalContext } from '../../services/global.context';
import EditSharpIcon from '@mui/icons-material/EditSharp';

export default function EditarVideo({ video_id, aulas, materias }) {

    const [open, setOpen] = React.useState(false);
    const { update, getById } = useFetch()
    const { state } = useContext(GlobalContext)
    const sortedAulas = aulas.sort((a, b) => a.aula_nombre.localeCompare(b.aula_nombre))
    const [successMessage, setSuccessMessage] = useState('')

    const initialForm = {
        video_descripcion: '',
        video_link: '',
        video_aula: '',
        video_materia: '',
    }

    const validate = (form) => {
        let errors = {}

        // if (!form.profesor_usuario.trim()) {
        //   errors.profesor_usuario = "El campo 'Usuario' es requerido"
        // }

        // if (!form.profesor_password.trim()) {
        //   errors.profesor_password = "El campo 'Contraseña' es requerido"
        // }
        return errors
    }

    const enviarDatos = async () => {

        try {
            // Realiza la operacion POST con el formulario actual
            await update(video_id, form, 'Video', 'UPDATE_VIDEO', {})
            setSuccessMessage('¡Operación Existosa!')

        } catch (e) {
            console.error('Error en la consulta', e)
        } finally {
            setTimeout(() => {
                if (successMessage !== '') {
                    handleClose(); // Cerrar el diálogo después de 2 segundos
                }
            }, 4000);
        }
    };

    const {
        form,
        setForm,
        errors,
        loadingForm,
        handleBlur,
        handleChange,
        handleSubmit,
    } = useForm(validate, initialForm, enviarDatos)

    useEffect(() => {
        // Cuando cambia state.getAlumno, actualiza el estado del formulario
        setForm({
            video_id: state.getVideo?.video_id || '',
            video_descripcion: state.getVideo?.video_descripcion || '',
            video_link: state.getVideo?.video_link || '',
            video_materia: state.getVideo?.video_materia || '',
            video_aula: state.getVideo?.video_aula || '',
        });
    }, [state.getVideo])

    const handleClickOpen = () => {
        getById(video_id, 'Video', 'GET_VIDEO', {})
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSuccessMessage(''); // Limpiar mensaje de éxito
    };



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
                <DialogTitle>Editar Video</DialogTitle>
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
                                Edite los datos del Video
                            </DialogContentText>

                            <TextField
                                id="video_descripcion"
                                name="video_descripcion"
                                label="Descripción *"
                                multiline
                                rows={5}
                                variant="standard"
                                fullWidth
                                value={form.video_descripcion}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={!!errors.video_descripcion}
                                helperText={errors.video_descripcion}
                            />

                            <TextField
                                autoFocus
                                margin="dense"
                                id="video_link"
                                name="video_link"
                                label="Link"
                                type="text"
                                fullWidth
                                variant="standard"
                                value={form.video_link}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={!!errors.video_link}
                                helperText={errors.video_link}
                            />
                            <Box sx={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
                                <Box sx={{ width: '50%' }}>
                                    <InputLabel id="materia-label" sx={{ mt: 2 }}>
                                        Aula
                                    </InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        name="video_aula"
                                        value={form?.video_aula}
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
                                        name="video_materia"
                                        value={form?.video_materia}
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
    );
}