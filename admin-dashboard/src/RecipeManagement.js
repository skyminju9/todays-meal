import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RecipeManagement = () => {
  const [recipes, setRecipes] = useState([]);

  const buttonstyle = {

    margin: '3px 10px',
    color: 'black',
    fontWeight: 'normal',
    fontSize: '15px',
    backgroundColor: '#e8e8e8',
    border: '1px solid black',
    width: 60,
    height: 25,
    cursor: 'pointer',

  };

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
    <div style={{padding:'20px'}}>
      <h1>Recipe Management</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th style={{ padding: '1px' }}>Name</th>
            <th style={{ padding: '2px' }}>Category</th>
            <th style={{ padding: '2px' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {recipes.map(recipe => (
            <tr key={recipe.id}>
              <td style={{ padding: '2px' }}>{recipe.id}</td>
              <td style={{ paddingLeft: '10px' }}>{recipe.name}</td>
              <td style={{ padding: '2px' }}>
                {Array.isArray(recipe.category) ? recipe.category.join(', ') : recipe.category}
              </td>
              <td style={{ padding: '2px' }}>
                <button style={buttonstyle} onClick={() => handleDelete(recipe.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecipeManagement;
