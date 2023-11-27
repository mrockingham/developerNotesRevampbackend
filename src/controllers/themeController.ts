import UserTheme from "../models/userThemesModel"

import express, { Request, Response } from 'express';


// Get theme
export const getTheme = async (req: Request, res: Response) => {
    try {
        const { name } = req.params; // Use req.params to get the parameter value
        console.log('theme name', req.params)
        const theme = await UserTheme.findOne({ name });

        if (theme) {
            res.status(200).json(theme);
        } else {
            res.status(404).json({ error: 'Theme not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const addTheme = async (req: Request, res: Response) => {
    try {
        const {
            name,
            gradient,
            backgroundGradient1,
            backgroundGradient2,
            backgroundGradient3,
            backgroundSolid,
            backgroundText,
            foregroundText,
            boxShadows,
            boxShadowSettings1,
            boxShadowSettings2
        } = req.body;
        console.log(req.body)

        // Step 1 find matching theme

        const theme = await UserTheme.findOne({ name }).exec()

        if (theme) {
            res.status(409).send({ error: 'theme already exist' });
            return;
        } else {
            //Step 2 if no matching theme add new theme

            const theme = await UserTheme.create({
                name,
                gradient,
                backgroundGradient1,
                backgroundGradient2,
                backgroundGradient3,
                backgroundSolid,
                backgroundText,
                foregroundText,
                boxShadows,
                boxShadowSettings1,
                boxShadowSettings2

            })

            return res.status(201).send({
                message: `Theme ${name} created`
            })

        }






    } catch (err) {
        console.log(err)
        return res.status(500).send(err)
    }

}

