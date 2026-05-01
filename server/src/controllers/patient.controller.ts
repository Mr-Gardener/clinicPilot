import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../types/express';

const prisma = new PrismaClient();

export const createPatient = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, dob, phone, insurance, medicalHistory } = req.body;

    const patient = await prisma.patient.create({
      data: {
        name,
        email,
        dob: dob ? new Date(dob) : null,
        phone,
        insurance,
        medicalHistory,
      },
    });

    return res.status(201).json(patient);
  } catch (error) {
    console.error('CREATE PATIENT ERROR:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getPatients = async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const patients = await prisma.patient.findMany({
      where: {
        name: { contains: String(search), mode: 'insensitive' },
      },
      skip,
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.patient.count({
      where: {
        name: { contains: String(search), mode: 'insensitive' },
      },
    });

    return res.json({
      data: patients,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const updatePatient = async (req: AuthRequest, res: Response) => {
  try {
    const updated = await prisma.patient.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });

    return res.json(updated);
  } catch (error) {
    console.error('UPDATE PATIENT ERROR:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const deletePatient = async (req: AuthRequest, res: Response) => {
  try {
    await prisma.patient.delete({
      where: { id: Number(req.params.id) },
    });

    return res.json({ message: 'Patient deleted' });
  } catch (error) {
    console.error('DELETE PATIENT ERROR:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
