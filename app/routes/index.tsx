import axios from 'axios';
import { ActionFunction, Form } from 'remix';

export const action: ActionFunction = async ({ request }) => {
  const body = await request.formData();
  console.log(process.env.API_URL);
  const { data } = await axios.post(`${ process.env.API_URL }/`, { url: body.get('url') });

  return data;
};

export default function Index() {
  return (
    <>
      <h1>Nutrition Thing</h1>
      <Form method="post">
        <div>
          <label htmlFor="website">Recipe Url:</label>
          <input type="text" id="website" name="url" />
        </div>
        <div>
          <button type="submit">Get Nutrition</button>
        </div>
      </Form>
    </>
  );
}
