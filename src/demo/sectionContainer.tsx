import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const SectionContainer: React.FC<SectionContainerProps> = ({ children, title, classes }) => {

    return (
        <Card className={classes.card}>
            <CardContent>
                <Typography className={classes.title} align='left'>
                    {title}
                </Typography>
                {children}
            </CardContent>
        </Card>
    );
};

interface SectionContainerProps {
    title: string,
    classes: any
}

export default SectionContainer;
