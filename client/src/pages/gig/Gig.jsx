import React from "react";

const Gig = () => { 
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-semibold text-center mb-6">Add New Gig</h2>
            <form className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                placeholder="Gig Title"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2">
                <option value="">Select Category</option>
                <option value="design">Design</option>
                <option value="development">Development</option>
                <option value="writing">Writing</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                rows={4}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                placeholder="Gig Description"
                ></textarea>
            </div>
            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
            >
                Add Gig
            </button>
            </form>
        </div>
        </div>
    );
    }
export default Gig;