import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import SectionContainer from './sectionContainer';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
            width: '75%',
            border: 'black solid 2px',
            padding: '20px'
        },
        paper: {
            padding: theme.spacing(2),
            textAlign: 'center',
            color: theme.palette.text.secondary,
        },
        card: {
            minWidth: 275,
            height: '250px'
        },
        bullet: {
            display: 'inline-block',
            margin: '0 2px',
            transform: 'scale(0.8)',
        },
        title: {
            fontSize: 14,
        },
        pos: {
            marginBottom: 12,
        },
    }),
);

const DemoControlSection: React.FC<DemoDSectionProps> = ({ params, control, detail }) => {
    const classes = useStyles();
    const Params = params || (() => null);
    const Control = control || (() => null);
    const Detail = detail || (() => null);

    return (
        <div className={classes.root}>
            <Typography className={classes.title} align='left'>Text Input</Typography>
            <Grid container spacing={3}>
                <Grid item md={4} xs={12} sm={4}>
                    <SectionContainer title="Parameter" classes={classes}>
                        <Params />
                    </SectionContainer>
                </Grid>
                <Grid item md={4} xs={12} sm={4}>
                    <SectionContainer title="Control" classes={classes}>
                        <Control />
                    </SectionContainer>
                </Grid>
                <Grid item md={4} xs={12} sm={4}>
                    <SectionContainer title="Detail" classes={classes}>
                        <Detail />
                    </SectionContainer>
                </Grid>
            </Grid>
        </div>
    );
}

interface DemoDSectionProps {
    params: any;
    control: any;
    detail: any;
}

export default DemoControlSection;
