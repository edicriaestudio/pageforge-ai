const { createClient } = require('@supabase/supabase-js');
const url = 'https://pexbtyslnrpqfckoasks.supabase.co';
const key = 'sb_publishable_Y_8dNIOvcHciBZLI2efsdQ_GXKjGwPq'; // No wait, he gave me sb_publishable which isn't the anon key!
const supabase = createClient(url, key);

async function test() {
  const { data, error } = await supabase.from('projects').insert([{ name: 'Test', slug: 'test' }]);
  console.log('Data:', data);
  console.log('Error:', error);
}
test();
