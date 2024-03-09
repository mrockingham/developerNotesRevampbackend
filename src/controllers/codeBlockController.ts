import UserCodeBlock from "../models/userCodeBlock";
import User from "../models/userModel";
import ProviderUser from "../models/providerUserModel";
import express, { Request, Response } from 'express';


export const getCodeBlocks = async (req: Request, res: Response) => {
    const codeBlock = req.body

    try {
        const userCodeblocks = await UserCodeBlock.find();
        res.status(200).json(userCodeblocks);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
export const getAllCodeblocksInCategory = async (req: Request, res: Response) => {
    const { creator, category, } = req.body

    try {
        const userCodeblocks = await UserCodeBlock.find({
            creator,
            category
        });
        res.status(200).json(userCodeblocks);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

//Find Code Blocks By Id
export const getCodeBlockById = async (req: Request, res: Response) => {
    const { id, creator, category, } = req.body

    console.log('get by id', req.body)

    try {
        const userCodeblock = await UserCodeBlock.findOne(
            {
                _id: id,
                creator: creator,
                category: category

            }).exec();

        console.log('the user block', userCodeblock)
        res.status(200).json(userCodeblock);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
export const getCodeBlockByCreator = async (req: Request, res: Response) => {
    const creator = req.body

    console.log('what am i getting', req.body)

    try {
        const userCodeblock = await UserCodeBlock.find(creator);
        res.status(200).json(userCodeblock);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Find Code Blocks By user Category
export const getCodeBlockByUserCategory = async (req: Request, res: Response) => {
    const { creator } = req.body




    try {
        const codeBlocks = await UserCodeBlock.aggregate([
            {
                $match: {
                    creator,
                    category: { $exists: true, $ne: '' }
                }
            },
            {
                $group: {
                    _id: "$category",  // Group by category
                    firstCodeBlock: { $first: "$$ROOT" }  // Get the first document for each category
                }
            },
            {
                $replaceRoot: { newRoot: "$firstCodeBlock" }  // Replace the root with the firstCodeBlock
            }
        ]);
        // const codeBlocks = await UserCodeBlock.find({ creator, category: { $exists: true, $ne: '' } });
        res.status(200).json(codeBlocks);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }


};

// Delete a codeBlock
export const deleteCodeBlockByUserId = async (req: Request, res: Response) => {

    const idParams = req.params

    console.log(idParams)

    try {

        const userCodeblock = await UserCodeBlock.deleteOne(idParams);

        console.log(userCodeblock)
        res.status(200).json({ message: 'Code Block Deleted' });
    }

    catch (error) {
        res.status(404).json({ message: error.message });
    }
};

//Find If code block exist for user
export const getCodeBlockExists = async (req: Request, res: Response) => {


    const { creator, category, title } = req.body

    try {

        const userCodeblocks = await UserCodeBlock.exists({
            creator: creator,
            title: title,
            category: category
        });
        res.status(200).json(userCodeblocks);
        // console.log(userCodeblocks)
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Create a codeblock
export const createCodeBlock = async (req: Request, res: Response) => {
    // const codeBlock = req.body;
    // console.log('create code', codeBlock)
    try {
        const { creator, provider, title, category } = req.body
        const codeBlock = req.body
        const newCodeBlock = new UserCodeBlock(codeBlock);
        if (provider) {
            const providerUser = await ProviderUser.findOne({ email: creator }).exec();
            const prevTitle = await UserCodeBlock.findOne({ title })
            if (creator != providerUser?.email) {
                return res.status(409).json({ message: "User doesn't exist" })
            }
            else if (providerUser?.email === creator && prevTitle?.title === title && prevTitle?.category === category) {
                console.log('the prevTitle', prevTitle)
                // res.status(409).json({ message: 'title already exist' })
                try {
                    const newOrReplace = await UserCodeBlock.replaceOne(
                        prevTitle?.id,
                        codeBlock,
                        { upsert: true }
                    );
                    res.status(201).json({ newOrReplace, message: 'Code Block Updated' });
                } catch (error) {
                    res.status(409).json({ message: error.message });
                }
            } else {
                await newCodeBlock.save();
                res.status(201).json(newCodeBlock);

            }

        } else {
            console.log('creator reg', creator)
            const user = await User.findOne({ email: creator }).exec();
            const prevTitle = await UserCodeBlock.findOne({ title })

            console.log('reg user email', user?.email === creator)
            console.log('title', title)
            console.log('prevTitle', prevTitle)

            if (creator != user?.email) {
                return res.status(409).json({ message: "User doesn't exist" })
            }
            else if (user?.email === creator && prevTitle?.title === title) {
                try {
                    const newOrReplace = await UserCodeBlock.replaceOne(
                        { _id: prevTitle?.id },
                        codeBlock,
                        { upsert: true }
                    );
                    res.status(201).json({ newOrReplace, message: 'Code Block Updated' });
                } catch (error) {
                    res.status(409).json({ message: error.message });
                }
            } else {
                await newCodeBlock.save();
                res.status(201).json(newCodeBlock);

            }
        }
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};
// Replace a codeblock
export const editCodeBlock = async (req: Request, res: Response) => {
    const codeBlockId = req.params

    const codeBlock = req.body;


    try {
        const newOrReplace = await UserCodeBlock.replaceOne(
            codeBlockId,
            codeBlock,
            { upsert: true }
        );
        res.status(201).json({ newOrReplace, message: 'Code Block Updated' });
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};