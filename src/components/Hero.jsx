import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Hero = () => {
    const [post, setPost] = useState(null);
    const [reload, setReload] = useState(false);
    const [edit, isEdit] = useState(false);
    const [currentPost, setCurrentPost] = useState(null);

    useEffect(() => {
        axios
            .get("http://localhost:4002/post")
            .then(res => setPost(res.data));
    }, [reload]);

    const handleCreate = e => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const post = Object.fromEntries(formData);
        
        if (edit) {
            axios
                .put(`http://localhost:4002/post/${currentPost.id}`, post)
                .then(res => {
                    console.log(res);
                    setReload(p => !p);
                    isEdit(false);
                    setCurrentPost(null);
                    e.target.reset();
                });
        } else {
            axios
             .post("http://localhost:4002/post", post)
             .then(res => {
                console.log(res);
                e.target.reset();
                setReload(prev => !prev);
             });
        }
    };

    const handleDelete = id => {
        console.log(id);
        
        axios
            .delete(`http://localhost:4002/post/${id}`)
            .then(res => {
                setReload(p => !p);
            });
    };

    const handleEdit = post => {
        isEdit(true);
        setCurrentPost(post);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="max-w-md mx-auto"
            >
                <form
                    onSubmit={handleCreate}
                    className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg shadow-xl rounded-xl px-8 pt-6 pb-8 mb-4"
                >
                    <h2 className="text-3xl font-extrabold text-center text-white mb-6">
                        {edit ? "Edit Post" : "Create New Post"}
                    </h2>
                    <div className="mb-4">
                        <motion.input
                            whileFocus={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                            type="text"
                            placeholder="Title..."
                            name="title"
                            className="shadow-inner appearance-none border border-transparent rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent bg-white bg-opacity-50"
                            defaultValue={edit ? currentPost.title : ""}
                        />
                    </div>
                    <div className="mb-6">
                        <motion.input
                            whileFocus={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                            type="text"
                            placeholder="Description..."
                            name="desc"
                            className="shadow-inner appearance-none border border-transparent rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent bg-white bg-opacity-50"
                            defaultValue={edit ? currentPost.desc : ""}
                        />
                    </div>
                    <div className="flex items-center justify-center">
                        <button
                            className="bg-purple-600 text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:shadow-outline transition-all duration-300 ease-in-out hover:bg-purple-700 hover:shadow-lg"
                            type="submit"
                        >
                            {edit ? "Save Changes" : "Create Post"}
                        </button>
                    </div>
                </form>
            </motion.div>
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="max-w-7xl mx-auto mt-12 grid gap-6 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1"
                >
                    {post?.map((item) => (
                        <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.5 }}
                            className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl overflow-hidden transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl"
                        >
                            <div className="px-6 py-4">
                                <h3 className="font-bold text-xl mb-2 text-white">{item.title}</h3>
                                <p className="text-gray-200 text-base">{item.desc}</p>
                            </div>
                            <div className="px-6 pt-4 pb-2 flex justify-end space-x-2">
                                <button
                                    onClick={() => handleEdit(item)}
                                    className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 ease-in-out hover:shadow-lg"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(item.id)}
                                    className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 ease-in-out hover:shadow-lg"
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default Hero;

