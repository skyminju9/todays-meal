import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RecipeManagement = () => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    // Fetch recipes from the server
    axios.get('http://ceprj.gachon.ac.kr:60022/admin-recipe')
      .then(response => {
        setRecipes(response.data);
      })
      .catch(error => {
        console.error('Error fetching recipes:', error);
      });
  }, []);

  const handleDelete = (id) => {
    // Delete recipe with the given id using a POST request
    axios.post('http://ceprj.gachon.ac.kr:60022/admin-recipe/delete', { id })
      .then(response => {
        // Update the recipes state after successful deletion
        setRecipes(recipes.filter(recipe => recipe.id !== id));
      })
      .catch(error => {
        console.error('Error deleting recipe:', error);
      });
  };

  return (
    <div>
      <h1>Recipe Management</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Category</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {recipes.map(recipe => (
            <tr key={recipe.id}>
              <td>{recipe.id}</td>
              <td>{recipe.name}</td>
              <td>
                {Array.isArray(recipe.category) ? recipe.category.join(', ') : recipe.category}
              </td>
              <td>
                <button onClick={() => handleDelete(recipe.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecipeManagement;
