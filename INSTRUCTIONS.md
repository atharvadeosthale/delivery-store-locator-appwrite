This is a Next.js app. I want you to build a very absolutely stunning, interactive and aesthetically pleasing, yet minimal with no stupid neon effects app which has following functionality.

- Users can choose two stores and calculate distance between them
- Users can add stores by clicking a button and choosing a location from an openstreetmap map, which will send latitude and longitude to API
- Users can also delete stores.

Here are some more technical details

- Whenver someone adds store, send an POST API request to /api/store. Create that route for me in this Next.js app. Do nothing there I will add my own DB logic. Send in { name, location: {lat, lon} } as data
- Same for DELETE /api/store, just give me the {id}.
- Fetch all using GET /api/store, for now return some dummy data {$id, name, location: {lat, lon}}

Use dummy data in API for now.

The design MUST look modern and aesthetically pleasing. Think like a lead design engineer.

Use shadcn components when necessary and if needed

UPDATED INSTRUCTIONS;

Looks like distance calc is easy. Make an app where it checks which stores are serviceable for an user. User will input delivery location through map and get the list of stores that can service to that area.

Also make sure to put the add and remove store someplace where it's not directly visible but can be opened through popups. main page should only allow user to choose delivery location and see serviceable stores

Use GET /check for that and send in the user's selected delivery point.
