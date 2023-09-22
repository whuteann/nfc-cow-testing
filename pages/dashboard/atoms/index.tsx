import PasswordField from "@/components/atoms/Input/text/inputField/PasswordField";
import TextInputField from "@/components/atoms/Input/text/inputField/TextInputField";
import QuillField from "@/components/atoms/Input/text/textarea/QuillField";
import TextareaField from "@/components/atoms/Input/text/textarea/TextareaField";
import DropdownField from '@/components/atoms/Input/dropdown/DropdownField';
import DropdownInputField from '@/components/atoms/Input/dropdown/DropdownInputField';
import Datepicker from '@/components/atoms/Input/datetimepicker/Datepicker';
import Timepicker from '@/components/atoms/Input/datetimepicker/Timepicker';
import DateTimepicker from '@/components/atoms/Input/datetimepicker/DateTimepicker';
import Text from "@/components/atoms/Text";
import Master from "@/layouts/BaseLayout/master";
import { MetaProps } from "@/types/Common";
import { AccountCircle } from "@mui/icons-material";
import { Grid } from "@mui/material";
import CheckboxComponent from "@/components/atoms/Input/checkbox/CheckboxComponent";

const metaProp: MetaProps = {
  title: 'Atoms',
  description: 'Welcome to atoms'
}

const items = [
  {
  label: 'Item 1',
  value: 'Item 1',
  },
  {
  label: 'Item 2',
  value: 'Item 2',
  },
  {
  label: 'Item 3',
  value: 'Item 3',
  },
  {
    label: 'Item 4',
    value: 'Item 4',
  },
]

function Home() {
  return (
    <Grid 
      container 
      direction="row"
      justifyContent="center"
      alignItems="center"
      spacing={2}>
      <Text>Hello:</Text>

      <Grid item xs={4}>
        <Text>Text Input</Text>
        <TextInputField
          name='username'
          placeholder='Enter name here'
          label='Username'
          onChangeText={(name) => {  }}
          hasIcon={true}
          hasError={true}
          icon={<AccountCircle />}
        />

        <Text>Password field</Text>
        <PasswordField
          name='password'
          placeholder='Enter password'
          label='Password'
          onChangeText={(password) => {  }}
        />

        <Text>Textarea</Text>
        <TextareaField
          name='details'
          placeholder='Details here'
          label='Details'
          onChangeText={(password) => {}}
        />

        <Text>WYSIWYG Editor</Text>
        <QuillField
          value='feleo'
          placeholder='Enter blog'
          onChangeText={(content) => { }}
        />

        <Text>Dropdown Field</Text>
        <DropdownField 
          items={items} 
          label='Item label here' 
          placeholder='Select items' 
          disabled={false} 
          hasError={false} 
          errorMessage='it has error' 
        />

        <Text>Dropdown Input Field</Text>
        <DropdownInputField 
          items={items} 
          label='Item label' 
          disabled={false} 
          disabledMessage='it is disabled' 
          hasError={false} 
          errorMessage='it has error' 
          />

        <Text>Checkbox</Text>
        <CheckboxComponent
          title='Checkbox 1'
          onChecked={(checked) => {  }}
          hasError={false}
          errorMessage='Error message here'
        />

        <Text>Date picker</Text>
        <Datepicker
          label='Date picker'
          placeholder='Enter date here'
          onChangeDate={ (date: Date | null) => { }}
          disabled={false}
        />

        <Text>Time picker</Text>
        <Timepicker
          label='Time picker'
          placeholder='Enter time here'
          onChangeTime={ (time: Date | null) => { }}
          disabled={false}
        />

        <Text>Date and Time picker</Text>
        <DateTimepicker
          label='Date Time picker'
          placeholder='Enter date time here'
          onChangeDateTime={ (dateTime: Date | null) => { }}
          disabled={false}
        />
      </Grid>
    </Grid>
  );
};

Home.getLayout = (page: any) => (
  <Master 
    metaProps={metaProp}
  >
    {page}
  </Master>
);

export default Home;