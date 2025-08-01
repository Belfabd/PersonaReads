import {Book, InsightResponse, SearchResponse} from "../types";

export async function getBook(apiKey: string, name: string): Promise<{ book: Book, entity_id: string } | undefined> {
  return new Promise((resolve) => {
    const url = `https://hackathon.api.qloo.com/search?query=${name}&page=1&take=2`;
    const options = {method: "GET", headers: {"accept": "application/json", "X-Api-Key": apiKey}};
    fetch(url, options)
      .then((res) => res.json())
      .then((response: SearchResponse) => {
        const topResults = response.results.filter((res) => res.types.includes("urn:entity:book"));

        if (topResults.length === 0) resolve(undefined);
        else {
          const topResult = topResults[0];
          resolve({
            entity_id: topResult.entity_id,
            book: {
              name: topResult.name,
              imageUrl: topResult.properties.image.url,
              description: topResult.properties.description,
              tags: topResult.tags?.map((tag) => tag.name) ?? [],
            },
          });
        }
      })
      .catch((err) => {
        console.error(err);
        resolve(undefined);
      });
  });
}

export async function getRecommendations(apiKey: string, entityId: string): Promise<Book[] | undefined> {
  return new Promise((resolve) => {
    const url = `https://hackathon.api.qloo.com/v2/insights?filter.type=urn%3Aentity%3Abook&signal.interests.entities=${entityId}&take=10`;
    const options = {method: "GET", headers: {"accept": "application/json", "X-Api-Key": apiKey}};

    fetch(url, options)
      .then((res) => res.json())
      .then((json: InsightResponse) => {
        if (!json.success) resolve(undefined);
        else {
          resolve(json.results.entities.map((entity) => ({
            name: entity.name,
            imageUrl: entity.properties.image.url,
            description: entity.properties.description,
            tags: entity.tags?.map((tag) => tag.name) ?? [],
          })));
        }
      })
      .catch((err) => {
        console.error(err);
        resolve(undefined);
      });
  });
}
