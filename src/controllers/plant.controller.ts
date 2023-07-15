import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { Between, MoreThan, LessThan } from "typeorm";
import { Image } from "../entities/image.entity";
import { Plant } from "../entities/plant.entity";
import { User } from "../entities/user.entity";
import { paginateResponse } from "../util/pagination";
import { Category } from "../entities/category.entity";
import { Like } from "../entities/like.entity";
import { Village } from "../entities/village.entity";

export const postPlant: RequestHandler = async (req, res, next) => {
    const {
        name,
        description,
        latitude,
        longitude,
        village_id,
        planting_date,
        planting_count,
        category_id,
    } = req.body;
    const user_id = req.user_id;

    try {
        const user = await User.findOneByOrFail({ id: user_id });
        const category = await Category.findOneByOrFail({ id: category_id });
        const village = await Village.findOneOrFail({ where: { id: village_id }, relations: { district: { regency: { province: true } } } });
        const district = village.district;
        const regency = district.regency;
        const province = regency.province;

        const imageFiles = req.files as Express.Multer.File[];

        if (!imageFiles?.length) return next(createHttpError(400, "Image must not be empty"));

        const images = imageFiles.map((f) => {
            const image = new Image();
            image.file_path = f.path.replace(/\\/g, '/');
            return image;
        });

        const plantingDate = new Date(parseInt(planting_date));

        const newPlant = new Plant();
        newPlant.user = user;
        newPlant.category = category;
        newPlant.latitude = latitude;
        newPlant.longitude = longitude;
        newPlant.village = village;
        newPlant.description = description;
        newPlant.images = images;
        newPlant.plant_name = name;
        newPlant.planting_date = plantingDate;
        newPlant.planting_count = planting_count;

        const plant = await newPlant.save();

        const allowEdit = plant.user.id == user.id;
        req.body = {
            id: plant.id,
            name: plant.plant_name,
            description: plant.description,
            liked: plant.likes?.find((val) => val.user.id == user_id)?.is_like,
            likes_count: plant.likes?.filter((val) => val.is_like).length ?? 0,
            dislikes_count: plant.likes?.filter((val) => !val.is_like).length ?? 0,
            comments_count: plant.comments?.length,
            allow_edit: allowEdit,
            planting_date: plant.planting_date,
            planting_count: plant.planting_count,
            author: {
                id: plant.user.id,
                name: plant.user.name,
                avatar: plant.user.avatar_path
            },
            position: {
                latitude: plant.latitude,
                longitude: plant.longitude
            },
            created_at: plant.created_at,
            images: plant.images.map((image) => image.file_path),
            category: {
                id: plant.category.id,
                name: plant.category.name,
            },
            address: `${village.name}, ${district.name}, ${regency.name}, ${province.name}`
        };
        return next();
    } catch (err) {
        return next(err);
    }
}

export const getPlants: RequestHandler = async (req, res, next) => {
    const { category_id, from_timestamp, to_timestamp, author_id } = req.body;
    const user_id = req.user_id;

    const take = parseInt(req.query.take as string) || 20;
    const page = parseInt(req.query.page as string) || 1;

    let createdAtQuery;

    if (from_timestamp && to_timestamp) {
        createdAtQuery = Between(new Date(parseInt(from_timestamp) * 1000), new Date(parseInt(to_timestamp) * 1000));
    } else if (from_timestamp && !to_timestamp) {
        createdAtQuery = MoreThan(new Date(parseInt(from_timestamp) * 1000));
    } else if (!from_timestamp && to_timestamp) {
        createdAtQuery = LessThan(new Date(parseInt(to_timestamp) * 1000));
    }

    try {
        const data = await Plant.findAndCount({
            take: take,
            skip: (page - 1) * take,
            where: {
                category: {
                    id: category_id
                },
                created_at: createdAtQuery,
                user: {
                    id: author_id,
                }
            },
            relations: {
                user: true,
                images: true,
                category: true,
                likes: {
                    user: true
                },
                village: {
                    district: {
                        regency: {
                            province: true
                        }
                    }
                },
                comments: true,
            },
            order: {
                created_at: "DESC"
            }
        });

        const [plantData, total] = data;

        const plants = plantData.map((plant) => {
            const allowEdit = plant.user.id == user_id;
            const village = plant.village;
            const district = village.district;
            const regency = district.regency;
            const province = regency.province;

            return <unknown>{
                id: plant.id,
                name: plant.plant_name,
                description: plant.description,
                liked: plant.likes?.find((val) => val.user.id == user_id)?.is_like,
                likes_count: plant.likes?.filter((val) => val.is_like).length ?? 0,
                dislikes_count: plant.likes?.filter((val) => !val.is_like).length ?? 0,
                comments_count: plant.comments?.length,
                allow_edit: allowEdit,
                planting_date: plant.planting_date,
                planting_count: plant.planting_count,
                author: {
                    id: plant.user.id,
                    name: plant.user.name,
                    avatar: plant.user.avatar_path
                },
                position: {
                    latitude: plant.latitude,
                    longitude: plant.longitude
                },
                created_at: plant.created_at,
                images: plant.images.map((image) => image.file_path),
                category: {
                    id: plant.category.id,
                    name: plant.category.name,
                },
                address: `${village.name}, ${district.name}, ${regency.name}, ${province.name}`
            };
        });

        return res.status(200).json(paginateResponse([plants, total], page, take));
    } catch (err) {
        return next(err);
    }
}

export const getPlant: RequestHandler = async (req, res, next) => {
    const plant_id = Number(req.params.id);
    const user_id = req.user_id;

    try {
        const plant = await Plant.findOne({
            where: { id: plant_id },
            relations: {
                user: true,
                images: true,
                category: true,
                village: {
                    district: {
                        regency: {
                            province: true
                        }
                    }
                },
                likes: {
                    user: true
                }
            }
        });

        if (!plant) return next(createHttpError(404, `Plant with id: ${plant_id} does not exists`));

        const allowEdit = plant.user.id == user_id;
        const village = plant.village;
        const district = village.district;
        const regency = district.regency;
        const province = regency.province;

        req.body = {
            id: plant.id,
            name: plant.plant_name,
            description: plant.description,
            liked: plant.likes?.find((val) => val.user.id == user_id)?.is_like,
            likes_count: plant.likes?.filter((val) => val.is_like).length ?? 0,
            dislikes_count: plant.likes?.filter((val) => !val.is_like).length ?? 0,
            allow_edit: allowEdit,
            planting_date: plant.planting_date,
            planting_count: plant.planting_count,
            author: {
                id: plant.user.id,
                name: plant.user.name,
                avatar: plant.user.avatar_path
            },
            position: {
                latitude: plant.latitude,
                longitude: plant.longitude
            },
            created_at: plant.created_at,
            images: plant.images.map((image) => image.file_path),
            category: {
                id: plant.category.id,
                name: plant.category.name,
            },
            address: `${village.name}, ${district.name}, ${regency.name}, ${province.name}`
        };
        return next();
    } catch (err) {
        return next(err);
    }
}

export const updatePlant: RequestHandler = async (req, res, next) => {
    const id = Number(req.params.id);
    const { name, description, latitude, longitude, category_id, deleted_images, village_id } = req.body;

    const user_id = req.user_id;

    try {
        const plant = await Plant.findOne({
            where: { id: id },
            relations: {
                images: true,
                user: true,
                likes: { user: true },
                comments: true,
                village: {
                    district: {
                        regency: {
                            province: true
                        }
                    }
                }
            }
        });
        if (!plant) return next(createHttpError(400, `Plant with id ${id} not found`));

        const user = await User.findOneByOrFail({ id: user_id });
        const category = await Category.findOneByOrFail({ id: category_id });
        const village = await Village.findOneOrFail({ where: { id: village_id }, relations: { district: { regency: { province: true } } } });
        const district = village.district;
        const regency = district.regency;
        const province = regency.province;


        const imageFiles = req.files as Express.Multer.File[];

        const images = imageFiles.map((f) => {
            const image = new Image();
            image.file_path = f.path.replace(/\\/g, '/');
            return image;
        });

        if (deleted_images) {
            plant.images.forEach(async (element) => {
                const imageExist = deleted_images.includes(element.file_path);
                if (imageExist) {
                    await element.remove();
                }
            });
        }

        const oldImages = await Image.find({ where: { plant: { id: id } } });

        plant.plant_name = name;
        plant.description = description;
        plant.latitude = latitude;
        plant.longitude = longitude;
        plant.category = category;
        plant.village = village;
        plant.images = [...oldImages, ...images];

        await plant.save();

        const updatedPlant = await Plant.findOne({
            where: { id: id },
            relations: {
                images: true,
                user: true,
                likes: { user: true },
                comments: true,
                category: true,
            }
        });
        if (!updatedPlant) return next(createHttpError(400, 'Something went wrong, try again later'));

        const allowEdit = plant.user.id == user.id;
        req.body = {
            id: updatedPlant.id,
            name: updatedPlant.plant_name,
            description: updatedPlant.description,
            liked: updatedPlant.likes?.find((val) => val.user.id == user_id)?.is_like,
            likes_count: updatedPlant.likes?.filter((val) => val.is_like).length ?? 0,
            dislikes_count: updatedPlant.likes?.filter((val) => !val.is_like).length ?? 0,
            comments_count: updatedPlant.comments?.length,
            allow_edit: allowEdit,
            planting_date: updatedPlant.planting_date,
            planting_count: updatedPlant.planting_count,
            author: {
                id: updatedPlant.user.id,
                name: updatedPlant.user.name,
                avatar: updatedPlant.user.avatar_path
            },
            position: {
                latitude: updatedPlant.latitude,
                longitude: updatedPlant.longitude
            },
            created_at: updatedPlant.created_at,
            images: updatedPlant.images.map((image) => image.file_path),
            category: {
                id: updatedPlant.category.id,
                name: updatedPlant.category.name,
            },
            address: `${village.name}, ${district.name}, ${regency.name}, ${province.name}`
        };
        return next();
    } catch (err) {
        return next(err);
    }
}

export const deletePlant: RequestHandler = async (req, res, next) => {
    const plant_id = Number(req.params.id);

    try {
        const plant = await Plant.findOneBy({ id: plant_id });
        const result = await plant?.remove();

        if (!result) return next(createHttpError(404, `Plant with id: "${plant_id}" does not exists`));

        req.body = { message: "delete plant success" };
        return next();
    } catch (err) {
        return next(err);
    }
}

export const postLike: RequestHandler = async (req, res, next) => {
    const { user_id, is_like } = req.body;
    const plant_id = Number(req.params.id);
    try {
        const plant = await Plant.findOneByOrFail({ id: plant_id });
        const user = await User.findOneByOrFail({ id: user_id });

        const oldLike = await Like.findOne({ where: { user: { id: user_id }, plant: { id: plant_id } } });
        let like = new Like();

        if (oldLike) {
            if (oldLike.is_like == is_like) {
                req.body = {
                    message: 'plant already liked'
                }
                return next();
            } else {
                like = oldLike;
            }
        }

        like.plant = plant;
        like.user = user;
        like.is_like = is_like;

        const newLike = await like.save();

        req.body = {
            id: newLike.id,
            user_id: newLike.user.id,
            plant_id: newLike.plant.id
        }

        return next();
    } catch (err) {
        return next(err);
    }
}

export const deleteLike: RequestHandler = async (req, res, next) => {
    const user_id = req.body.user_id;
    const plant_id = Number(req.params.id);
    try {
        const like = await Like.findOneOrFail({ where: { user: { id: user_id }, plant: { id: plant_id } } });
        await like.remove();

        req.body = {
            message: 'delete like success'
        }
        return next();
    } catch (err) {
        return next(err);
    }
}