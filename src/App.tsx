import * as React from 'react';
import './style.css';

export default function App() {
  const [items, setItems] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  let [page, setPage] = React.useState(1);
  const observerTarget = React.useRef(null);

  const fetchData = () => {
    setIsLoading(true);
    fetch(`https://jsonplaceholder.typicode.com/todos?_page=${page}&_limit=10`)
      .then(async (response) => {
        const data = await response.json();
        setItems((prev) => [...prev, ...data]);
        setPage((prevstate) => prevstate + 1);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };

  React.useEffect(() => {
    // The Intersection Observer API is used to detect when an element    enters or exits the viewport
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          fetchData();
        }
      },
      { threshold: 1 } // element must be visible 100 percent
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [isLoading]);

  return (
    <div>
      <ul>
        {items.map((item, index) => (
          <li style={{ marginTop: 100 }} key={index}>
            {index} {item.title}
          </li>
        ))}
        {items && <li ref={observerTarget}></li>}
      </ul>
      {isLoading && <p>Loading...</p>}
    </div>
  );
}
