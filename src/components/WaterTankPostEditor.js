import React from 'react';
import { 
    withStyles,
    Card,
    CardContent,
    CardActions,
    Modal,
    Button,
    TextField,
} from '@material-ui/core';
import { KeyboardDatePicker } from "@material-ui/pickers";
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { Form, Field } from 'react-final-form';

const styles = theme => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalCard: {
        width: '90%',
        maxWidth: 500,
    },
    marginTop: {
        marginTop: theme.spacing(2),
    },
});

const PostEditor = ({ 
    classes, 
    waterTankPost, 
    onSave, 
    history,
    selectedDate,
    handleDateChange  }) => (
    <Form initialValues={waterTankPost} onSubmit={onSave}>
        {({ handleSubmit }) => (
            <Modal
            className={classes.modal}
            onClose={() => history.goBack()}
            open
        >
            <Card className={classes.modalCard}>
                <form onSubmit={handleSubmit}>
                    <CardContent className={classes.modalCardContent}>
                        <Field name="filledDate">
                            {({ input }) => <KeyboardDatePicker
                             clearable
                             label="filledDate" 
                             value={selectedDate} 
                             onChange={date => handleDateChange(date)} 
                             minDate={new Date()}
                             format="dd/MM/yyyy"
                             autoFocus {...input} 
                             animateYearScrolling
                             />}
                        </Field>
                        <Field name="comment">
                            {({ input }) => (
                                <TextField
                                    className={classes.marginTop}
                                    label="Comment"
                                    multilinerows={4}
                                    {...input}
                                />    
                            )}
                        </Field>
                    </CardContent>
                    <CardActions>
                        <Button size="small" color="primary" type="submit">Save</Button>
                        <Button size="small" onClick={() => history.goBack()}>Cancel</Button>
                    </CardActions>
                </form>
            </Card>
        </Modal>
        )}
    </Form>
);

export default compose(
    withRouter,
    withStyles(styles),
)(PostEditor);