import { RequestHandler } from "express";
import { Province } from "../entities/province.entity";
import { Regency } from "../entities/regency.entity";
import { District } from "../entities/district.entity";
import { Village } from "../entities/village.entity";

export const getProvinces: RequestHandler = async (req, res, next) => {
    try {
        const provinces = await Province.find({ order: { name: 'ASC' } });
        req.body = provinces;
        next();
    } catch (err) {
        next(err);
    }
}

export const getRegencies: RequestHandler = async (req, res, next) => {
    try {
        const province_id = Number(req.params.province_id);
        const regencies = await Regency.find({ where: { province: { id: province_id } }, relations: { province: true }, order: { name: 'ASC' } });
        req.body = regencies.map((val) => <unknown>{
            id: val.id,
            name: val.name,
            province_id: val.province.id,
        });
        next();
    } catch (err) {
        next(err);
    }
}

export const getAllRegencies: RequestHandler = async (req, res, next) => {
    try {
        const regencies = await Regency.find({ relations: { province: true }, order: { name: 'ASC' } });
        req.body = regencies.map((val) => <unknown>{
            id: val.id,
            name: val.name,
            province_id: val.province.id,
        });
        next();
    } catch (err) {
        next(err);
    }
}

export const getDistricts: RequestHandler = async (req, res, next) => {
    try {
        const regency_id = Number(req.params.regency_id);
        const districts = await District.find({ where: { regency: { id: regency_id } }, relations: { regency: true }, order: { name: 'ASC' } });
        req.body = districts.map((val) => <unknown>{
            id: val.id,
            name: val.name,
            regency_id: val.regency.id,
        });
        next();
    } catch (err) {
        next(err);
    }
}

export const getVillages: RequestHandler = async (req, res, next) => {
    try {
        const district_id = Number(req.params.district_id);
        const villages = await Village.find({ where: { district: { id: district_id } }, relations: { district: true }, order: { name: 'ASC' } });
        req.body = villages.map((val) => <unknown>{
            id: val.id,
            name: val.name,
            district_id: val.district.id,
        });
        next();
    } catch (err) {
        next(err);
    }
}