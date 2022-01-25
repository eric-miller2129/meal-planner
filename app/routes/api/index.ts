import { LoaderFunction, json, ActionFunction } from 'remix';
import recipeService from '~/utils/recipe.service';

export const loader: LoaderFunction = async () => {
  return new Response(null, {
    status: 405
  });

};

export const action: ActionFunction = async ({ request }) => {
  switch (request.method) {
    case "POST":
      const body = await request.json();
      let data;

      try {
        data = await recipeService.getNutrition(body.url);
      } catch (e: any) {
        return json({ message: e.message }, 400);
      }


      return json(data, 200);
    default:
      return new Response(null, {
        status: 405
      });
  }
}