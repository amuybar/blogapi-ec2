import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { uploadImage } from '../utils/cloudinaryService';
import { supabase } from '../utils/supabaseService';

const createBlog = async (req: Request, res: Response) => {
  const { title, summary, body, author } = req.body;

  try {
    // Access the file path of the uploaded image
    if (!req.file) {
      return res.status(400).send({ message: 'No image file provided' });
    }
    const imagePath = req.file.path;

    // Upload the image to Cloudinary
    const imageUrl = await uploadImage(imagePath, uuidv4());
    if (!imageUrl) {
      return res.status(500).send({ message: 'Image upload failed' });
    }

    // Generate slug and other properties
    const slug = title.toLowerCase().replace(/\s+/g, '-') + uuidv4();
    const date = new Date();

    // Insert into Supabase
    const { data, error } = await supabase
      .from('blogs')
      .insert([{ slug, title, summary, body, date, author, imageUrl }])
      .select();

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(500).send({ message: 'Blog creation failed: No data returned' });
    }

    res.status(201).send({
      message: 'Blog Created Successfully',
      data: data[0],
    });
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).send({
      message: 'Internal Error Occurred while Creating Blog',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};



const getAllBlogs = async (req: Request, res: Response) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const start = (Number(page) - 1) * Number(limit);
    const end = start + Number(limit) - 1;

    const { data, error, count } = await supabase
      .from('blogs')
      .select('*', { count: 'exact' })
      .range(start, end);
    

    if (error) throw error;

    // Check if data exists
    if (!data) {
      return res.status(404).send({
        message: 'No blogs found',
        data: [],
        total: 0,
      });
    }

    res.status(200).send({
      message: 'All Blogs',
      data,
      total: count || 0,
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).send({
      message: 'Internal Error Occurred while Fetching Blogs',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

const getBlogBySlug = async (req: Request, res: Response) => {
  console.log('Full params:', req.params);
  const { slug } = req.params; 
  console.log('Slug received:', slug);

  // If slug starts with ':', remove it
  const cleanedSlug = slug.startsWith(':') ? slug.slice(1) : slug;

  try {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('slug', cleanedSlug);  // Use cleaned slug

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(404).send({ message: 'Blog Not Found' });
    }

    res.status(200).send({
      message: 'Blog Retrieved Successfully',
      data: data[0],
    });
  } catch (error) {
    console.error('Error fetching blog by slug:', error);
    res.status(500).send({
      message: 'Internal Error Occurred while Fetching Blog by Slug',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};


const updateBlog = async (req: Request, res: Response) => {
  let { slug } = req.params;
  if (slug.startsWith(':')) slug = slug.slice(1);

  const { title, summary, body } = req.body;

  try {
    const { data, error } = await supabase
      .from('blogs')
      .update({ title, summary, body, date: new Date() })
      .eq('slug', slug)
      .select();

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(404).send({ message: 'Blog Not Found' });
    }

    res.status(200).send({
      message: 'Blog Updated Successfully',
      data: data[0],
    });
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).send({
      message: 'Internal Error Occurred while Updating Blog',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

const deleteBlog = async (req: Request, res: Response) => {
  let { slug } = req.params;
  if (slug.startsWith(':')) slug = slug.slice(1);

  try {
    const { data, error } = await supabase
      .from('blogs')
      .delete()
      .eq('slug', slug)
      .select();

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(404).send({ message: 'Blog Not Found' });
    }

    res.status(200).send({ 
      message: 'Blog Deleted Successfully',
      deletedBlog: data[0] 
    });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).send({
      message: 'Internal Error Occurred while Deleting Blog',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export {
  createBlog,
  getAllBlogs,
  getBlogBySlug,
  updateBlog,
  deleteBlog
};
