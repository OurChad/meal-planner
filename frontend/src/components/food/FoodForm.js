import React, { useState } from 'react';
import Select from 'react-select';
import Form from '../common/Form';

export default function FoodForm(props) {

  const foodTypes = [
    "BAKED",
    "CHEESE",
    "CONDIMENT",
    "DAIRY",
    "DRINK",
    "FRUIT",
    "MEAT",
    "OTHER",
    "TEA",
    "VEGETABLE",
  ];

  const emptyState = {
    name: '',
    subName: '',
    types: [],
    image: '',
  };

  const [food, setFood] = useState(props.food);
  const { setFoodData } = props;

  const saveToState = e => {
    let updatedFood;
    if (Array.isArray(e)) {
      updatedFood = { ...food, types: e.map(foodType => foodType.value) };
      setFood(updatedFood);
    } else {
      updatedFood = { ...food, [e.target.name]: e.target.value };
      setFood(updatedFood);
    }

    setFoodData(updatedFood);
  };

  const uploadFile = async e => {
    const files = e.target.files;
    const data = new FormData();
    data.append('file', files[0]);
    data.append('upload_preset', 'sickfits');
    data.append('folder', 'meal_planner/food');

    const res = await fetch('https://api.cloudinary.com/v1_1/ourchad/image/upload', {
      method: 'POST',
      body: data,
    });
    const file = await res.json();
    const updatedFood = {
      ...food,
      image: file.secure_url,
    };
    setFood(updatedFood);
    setFoodData(updatedFood);
  };

  const onSubmit = (e) => {
    props.onSubmit(e);

    if (props.resetFormOnSubmit) {
      setFood(emptyState);
    }
  }

  return (
    <Form
      method="post"
      onSubmit={onSubmit}
    >
      <fieldset disabled={props.loading} aria-busy={props.loading}>
        <h2>{props.title}</h2>              
        <label htmlFor="name">
                Name
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={food.name}
            onChange={saveToState}
          />
        </label>
        <label htmlFor="subName">
                SubName
          <input
            type="text"
            name="subName"
            placeholder="SubName i.e. Minced for Beef"
            value={food.subName}
            onChange={saveToState}
          />
        </label>
        <label htmlFor="types">
                Types
          <Select 
            name="types"
            isMulti
            options={foodTypes.map(foodType => ({value: foodType, label: foodType, key: foodType}))}
            value={food.types.map(foodType => ({value: foodType, label: foodType, key: foodType}))}
            onChange={saveToState}
          />
        </label>
        <label htmlFor="image">
                Image
          <input
            type="file"
            name="image"
            placeholder="Image for the food"
            onChange={uploadFile}
          />
          {food.image && (
            <img width="200" src={food.image} alt="Upload Preview" />
          )}
        </label>
        <button type="submit">{props.submitLabel}</button>
      </fieldset>         
    </Form>
  )
}
