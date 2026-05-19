import { Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { Parser } from 'json2csv';
import Lead from '../models/Lead';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import { LeadStatus, LeadSource, LeadQuery } from '../types';

export const leadValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('status').optional().isIn(['New', 'Contacted', 'Qualified', 'Lost']).withMessage('Invalid status'),
  body('source').optional().isIn(['Website', 'Instagram', 'Referral']).withMessage('Invalid source'),
];

export const createLeadValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('status').optional().isIn(['New', 'Contacted', 'Qualified', 'Lost']).withMessage('Invalid status'),
  body('source').isIn(['Website', 'Instagram', 'Referral']).withMessage('Source is required'),
];

export const getLeads = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status, source, search, sort = 'latest', page = 1, limit = 10 } = req.query as unknown as LeadQuery;

    const filter: Record<string, unknown> = {};

    if (status) filter.status = status;
    if (source) filter.source = source;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;
    const sortOrder = sort === 'oldest' ? 1 : -1;

    const [leads, total] = await Promise.all([
      Lead.find(filter).sort({ createdAt: sortOrder }).skip(skip).limit(limitNum).populate('createdBy', 'name email'),
      Lead.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: leads,
      meta: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) },
    });
  } catch (err) {
    next(err);
  }
};

export const getLead = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id).populate('createdBy', 'name email');
    if (!lead) return next(new AppError('Lead not found', 404));
    res.json({ success: true, data: lead });
  } catch (err) {
    next(err);
  }
};

export const createLead = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ success: false, message: errors.array()[0].msg });
    return;
  }
  try {
    const { name, email, status, source } = req.body as { name: string; email: string; status?: LeadStatus; source: LeadSource };
    const lead = await Lead.create({ name, email, status: status || 'New', source, createdBy: req.user!.id });
    res.status(201).json({ success: true, data: lead });
  } catch (err) {
    next(err);
  }
};

export const updateLead = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ success: false, message: errors.array()[0].msg });
    return;
  }
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return next(new AppError('Lead not found', 404));

    if (req.user!.role !== 'admin' && lead.createdBy.toString() !== req.user!.id) {
      return next(new AppError('Not authorized to update this lead', 403));
    }

    // Only allow specific fields to be updated — never createdBy
    const { name, email, status, source } = req.body as { name: string; email: string; status: LeadStatus; source: LeadSource };
    const updated = await Lead.findByIdAndUpdate(
      req.params.id,
      { name, email, status, source },
      { new: true, runValidators: true }
    );
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteLead = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return next(new AppError('Lead not found', 404));

    if (req.user!.role !== 'admin' && lead.createdBy.toString() !== req.user!.id) {
      return next(new AppError('Not authorized to delete this lead', 403));
    }

    await lead.deleteOne();
    res.json({ success: true, message: 'Lead deleted' });
  } catch (err) {
    next(err);
  }
};

export const getLeadsStats = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const stats = await Lead.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    const total = await Lead.countDocuments();
    const result: Record<string, number> = { total, New: 0, Contacted: 0, Qualified: 0, Lost: 0 };
    stats.forEach((s: { _id: string; count: number }) => { result[s._id] = s.count; });
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

export const exportLeadsCSV = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const leads = await Lead.find().populate('createdBy', 'name email').lean();
    const fields = ['name', 'email', 'status', 'source', 'createdAt'];
    const parser = new Parser({ fields });
    const csv = parser.parse(leads);
    res.header('Content-Type', 'text/csv');
    res.attachment('leads.csv');
    res.send(csv);
  } catch (err) {
    next(err);
  }
};
