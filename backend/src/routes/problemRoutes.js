import { Router } from "express";
const router = Router();
import { getProblems } from "../controllers/problemController.js";

/**
 * Get a list of problems with optional filters and pagination.
 *
 * Query Parameters:
 * - `difficulties` (optional): JSON string with division names and problem indexes to filter by. Example: '{"div2": ["A", "B"], "div3": ["C"]}'
 * - `tags` (optional): JSON string with an array of tags to filter problems by. Example: '["math", "geometry"]'
 * - `minRating` (optional): Minimum rating to include in results. Only problems with this rating or higher will be shown.
 * - `maxRating` (optional): Maximum rating to include in results. Only problems with this rating or lower will be shown.
 * - `page` (optional): Page number for pagination. Default is 1.
 * - `limit` (optional): Number of problems per page. Default is 20.
 *
 * Returns:
 * - A list of problems matching the filters and pagination settings.
 */
router.get("/", getProblems);

export default router;
