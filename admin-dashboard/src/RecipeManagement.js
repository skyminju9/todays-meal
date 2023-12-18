import React, { useState, useEffect } from 'react';

const RecipeManagement = () => {
  const [recipeList, setRecipeList] = useState([]);

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

  const handleDeleteRecipe = (recipeId) => {
    // Send a POST request to the server to delete the recipe
    fetch(`http://ceprj.gachon.ac.kr:60022/api/recipes/delete/${recipeId}`, {
      method: 'POST',
    })
      .then((response) => {
        if (response.ok) {
          // Update the recipe list after successful deletion
          setRecipeList((prevList) => prevList.filter((recipe) => recipe.id !== recipeId));
        } else {
          console.error('Error deleting recipe:', response.statusText);
        }
      })
      .catch((error) => console.error('Error deleting recipe:', error));
  };

  useEffect(() => {
    // Fetch recipe list from the server
    fetch('http://ceprj.gachon.ac.kr:60022/api/recipes')
      .then((response) => response.json())
      .then((data) => setRecipeList(data))
      .catch((error) => console.error('Error fetching recipe list:', error));
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Recipe Management</h2>
      <table>
        <thead>
          <tr>
            <th style={{ padding: '2px' }}>ID</th>
            <th style={{ padding: '2px' }}>Name</th>
            <th style={{ padding: '2px' }}>Category</th>
            {/* Add more columns based on your recipe data structure */}
            <th style={{ padding: '2px' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {recipeList.map((recipe) => (
            <tr key={recipe.id}>
              <td style={{ padding: '2px' }}>{recipe.id}</td>
              <td style={{ padding: '2px' }}>{recipe.name}</td>
              <td style={{ padding: '2px' }}>{recipe.category.join(', ')}</td>
              {/* Add more columns based on your recipe data structure */}
              <td style={{ padding: '2px' }}>
                {/* Add a button to delete recipe */}
                <button style={buttonstyle} onClick={() => handleDeleteRecipe(recipe.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecipeManagement;

