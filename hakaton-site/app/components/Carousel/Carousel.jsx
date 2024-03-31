import { useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import "../../globals.css";

export default function UncontrolledExample({ item }) {
  return (
    <div style={{ display: "block", width: 1200 }}>
      <Carousel>
        {item.images.map((image, index) => (
          <Carousel.Item key={index} interval={2500}>
            <img
              className="d-block w-100"
              src={image}
              alt={`Image ${index + 1}`}
            />
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
}
