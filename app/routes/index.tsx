import axios from 'axios';
import { ActionFunction, Form, LoaderFunction, redirect, json, useLoaderData, useTransition } from 'remix';
import { Nutrition } from '~/utils/models/Nutrition';
import recipeService from '~/utils/recipe.service';
import { commitSession, getSession } from '~/utils/sessions';

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'));
  const body = await request.formData();
  let nutrition;

  try {
    nutrition = await recipeService.getNutrition(body.get('url') as string);
  } catch (e: any) {
    session.flash('error', e.message);
    console.log(e.message);
    return redirect('/', {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    });
  }

  session.flash(
    'data',
    Object.entries(nutrition),
  );

  return redirect('/', {
    headers: {
      'Set-Cookie': await commitSession(session),
    }
  });
};

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(
    request.headers.get("Cookie")
  );
  const data = session.get('data') || null;
  const error = session.get('error') || null;
  console.log(error);
  return json(
    { data, error },
    {
      headers: {
        // only necessary with cookieSessionStorage
        "Set-Cookie": await commitSession(session)
      }
    }
  )
};

export default function Index() {
  const { data, error } = useLoaderData();
  const transition = useTransition();
  // console.log(Object.entries(data));

  return (
    <>
      { error && 'You fucked up bro.' }
      <h1>Nutrition Thing: {transition.state}</h1>
      <Form method="post">
        <div>
          <label htmlFor="website">Recipe Url:</label>
          <input type="text" id="website" name="url" />
        </div>
        <div>
          <button type="submit">Get Nutrition</button>
        </div>
      </Form>
      {data &&
        <>
          <h2>Deets:</h2>
          <ul>
            {
              data.map((n: any) => <li key={n[0]}><strong>{n[0]}: </strong>{n[1].value}</li>)
            }
          </ul>
        </>
      }
    </>
  );
}
