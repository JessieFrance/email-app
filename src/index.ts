import { app, PORT } from './app';

app.listen(PORT || 8888, () => {
  console.log(`Server running on port ${PORT || 8888}`);
});
