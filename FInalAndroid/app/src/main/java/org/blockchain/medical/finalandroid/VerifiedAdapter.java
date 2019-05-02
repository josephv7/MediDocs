package org.blockchain.medical.finalandroid;

import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import com.google.common.hash.Hashing;

import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class VerifiedAdapter extends RecyclerView.Adapter<VerifiedAdapter.MyViewHolder> {

    private List<Verified> verifiedList;
    String valsplit,docsplit,str2,str1;
    String[] splitval,splitdoc;
    Context context;
    ArrayList selectedItems;
    String status;
    String firstName;
    String lastName;
    String hospital;
    String doctorId;
    ArrayList<String> doctorIdList;
    ArrayList<String> doctorList;
    boolean[] checkedItemsArray;
    int x = 0;
    String recid;


    int flag = 0;

    String[] doctorArray;





    public class MyViewHolder extends RecyclerView.ViewHolder {
        public TextView classs, recordId, owner,valuev,doctorId;
        public Button bt1,bt2;
        ProgressBar pd;

        public MyViewHolder(View view) {
            super(view);
            recordId = (TextView) view.findViewById(R.id.recordId);
            valuev = (TextView) view.findViewById(R.id.valuev);
            doctorId = (TextView) view.findViewById(R.id.doctorId);
            bt1 = view.findViewById(R.id.bt1);
            bt2 = view.findViewById(R.id.bt2);
            pd = view.findViewById(R.id.pd1);



        }
    }


    public VerifiedAdapter(List<Verified> verifiedList) {
        this.verifiedList = verifiedList;
    }

    @Override
    public MyViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        final View itemView = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.row_layout, parent, false);

        context = parent.getContext();

        return new MyViewHolder(itemView);
    }

    @Override
    public void onBindViewHolder(final MyViewHolder holder, int position) {
        final Verified verified = verifiedList.get(position);
        str1 = "";
        str2 = "";

        valsplit = verified.getValuev().substring(1,verified.getValuev().length()-1);

        docsplit = verified.getDoctorId().substring(1,verified.getDoctorId().length()-1);






        holder.recordId.setText(" : "+verified.getRecordId());


        holder.valuev.setText(" : " + valsplit);


       holder.doctorId.setText(" : "+docsplit);



        if (verified.getVerified().equals("true"))
            holder.bt1.setText("SHARE");
        else
            holder.bt1.setText("VERIFY");

        holder.bt2.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                Intent viewIntent = new Intent(context,RecordView.class);
                viewIntent.putExtra("value",str1);
                context.startActivity(viewIntent);
            }
        });

        if (verified.getVerified().equals("true"))
            holder.bt1.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    Log.d("hi1","hi1");


                    getDoctors();
                    // setup the alert builder

                }


                private void getDoctors() {



                    Retrofit retrofit = new Retrofit.Builder()
                            .baseUrl(Api.BASE_URL)
                            .addConverterFactory(GsonConverterFactory.create()) //Here we are using the GsonConverterFactory to directly convert json data to object
                            .build();

                    Api api = retrofit.create(Api.class);

                    recid = verified.getRecordId();


                    Call<List<DoctorResponse>> call = api.getDoctors();



                    call.enqueue(new Callback<List<DoctorResponse>>() {
                        @Override
                        public void onResponse(Call<List<DoctorResponse>> call, Response<List<DoctorResponse>> response) {

                            doctorList = new ArrayList<String>();
                            doctorIdList = new ArrayList<String>();


                            List<DoctorResponse> docs = response.body();

                            for (int i = 0 ; i < docs.size();i++){
                                firstName = docs.get(i).firstName;
                                lastName = docs.get(i).lastName;
                                hospital = docs.get(i).hospital;
                                doctorId = docs.get(i).doctorId;


                                String[] temp;
                                temp = hospital.split("#");
                                hospital = temp[1];

                                String doctor = firstName + " " + lastName + "(" + hospital + ")";

                                doctorList.add(doctor);
                                doctorIdList.add(doctorId);


                            }

                            doctorArray = new String[doctorList.size()];
                            doctorArray = doctorList.toArray(doctorArray);

                            checkedItemsArray = new boolean[doctorArray.length];


                            splitdoc = ((String) holder.doctorId.getText()).split("\\b");


                            for (int i =0 ;i < doctorIdList.size();i++){
                                for (int j = 0 ; j < splitdoc.length; j++){
                                    if (doctorIdList.get(i).equals(splitdoc[j])){
                                        Log.d("iii",doctorIdList.get(i));
                                        Log.d("iii",splitdoc[j]);
                                        checkedItemsArray[i] = true;
                                        break;
                                    }else {
                                        checkedItemsArray[i] = false;
                                    }

                                }
                            }





                        dialog();


                        }


                        @Override
                        public void onFailure(Call<List<DoctorResponse>> call, Throwable t) {

                            Toast.makeText(context, t.getMessage(), Toast.LENGTH_SHORT).show();
                        }
                    });

                    }

            });
        else
            holder.bt1.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    Log.d("hi2","hi2");

                    DialogInterface.OnClickListener dialogClickListener = new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialog, int which) {
                            switch (which){
                                case DialogInterface.BUTTON_POSITIVE:
                                    holder.pd.setVisibility(View.VISIBLE);
                                    getVerified();
                                    break;

                                case DialogInterface.BUTTON_NEGATIVE:
                                    //No button clicked
                                    break;
                            }
                        }

                        private void getVerified() {

                            Retrofit retrofit = new Retrofit.Builder()
                                    .baseUrl(Api.BASE_URL)
                                    .addConverterFactory(GsonConverterFactory.create()) //Here we are using the GsonConverterFactory to directly convert json data to object
                                    .build();

                            Api api = retrofit.create(Api.class);

                            String username;


                            SharedPreferences pref = context.getSharedPreferences("MyPref", 0);
                            username = pref.getString("name","2001");


                            Call<List<VerificationResponse>> call = api.getVerified(verified.getRecordId(),username);

                            call.enqueue(new Callback<List<VerificationResponse>>() {
                                @Override
                                public void onResponse(Call<List<VerificationResponse>> call, Response<List<VerificationResponse>> response) {

                                    holder.pd.setVisibility(View.INVISIBLE);

                                    List<VerificationResponse> docs = response.body();

                                    status = docs.get(0).status;


                                    if (status.equals("ok")){

                                        Toast.makeText(context, "Verified", Toast.LENGTH_SHORT).show();

                                    }


                                }

                                @Override
                                public void onFailure(Call<List<VerificationResponse>> call, Throwable t) {

                                    Toast.makeText(context, t.getMessage(), Toast.LENGTH_SHORT).show();
                                }
                            });






                        }
                    };

                    AlertDialog.Builder builder = new AlertDialog.Builder(context);
                    builder.setMessage("Are you sure?").setPositiveButton("Yes", dialogClickListener)
                            .setNegativeButton("No", dialogClickListener).show();
                }
            });




    }

    private void dialog() {

        Log.d("xxxx","xxxx");

        selectedItems = new ArrayList();


        AlertDialog.Builder builder = new AlertDialog.Builder(context);
        builder.setTitle("Doctors List");

        //boolean[] checkedItems = {false, false};

        // add a checkbox list
        //final String[] doctors = {"doctor 1", "doctor 2", "doctor 3", "doctor 4", "doctor 5"};
        builder.setMultiChoiceItems(doctorArray, checkedItemsArray, new DialogInterface.OnMultiChoiceClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which, boolean isChecked) {
                // user checked or unchecked a box

                if (isChecked) {
                    // If the user checked the item, add it to the selected items
                    selectedItems.add(which);

                } else if (selectedItems.contains(which)) {
                    // Else, if the item is already in the array, remove it
                    selectedItems.remove(Integer.valueOf(which));
                }
            }
        });

        // add OK and Cancel buttons
        builder.setPositiveButton("OK", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                // user clicked OK

//                Log.d("userse", String.valueOf(checkedItemsArray[2]));
//
//                for (int i = 0; i < selectedItems.size();i++){
//
//                    Log.d("userselected",doctorArray[(int) selectedItems.get(i)]);
//
//
//
//                }
                setDoctor();
            }
        });
        builder.setNegativeButton("Cancel", null);

// create and show the alert dialog
        AlertDialog dialog = builder.create();
        dialog.show();
    }

    private void setDoctor() {

        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl(Api.BASE_URL)
                .addConverterFactory(GsonConverterFactory.create()) //Here we are using the GsonConverterFactory to directly convert json data to object
                .build();

        Api api = retrofit.create(Api.class);

        String pass = "";
        for (int i = 0; i < checkedItemsArray.length;i++){
            if (checkedItemsArray[i] == true){
                pass = pass + doctorIdList.get(i) + "."   ;

            }
        }
        pass = pass.substring(0,pass.length()-1);



        Call<List<ShareDoctorResponse>> call = api.setDoctor(recid,pass);

        call.enqueue(new Callback<List<ShareDoctorResponse>>() {
            @Override
            public void onResponse(Call<List<ShareDoctorResponse>> call, Response<List<ShareDoctorResponse>> response) {


                List<ShareDoctorResponse> docs = response.body();

                status = docs.get(0).status;


                if (status.equals("ok")){

                    Toast.makeText(context, "Shared", Toast.LENGTH_SHORT).show();

                }


            }

            @Override
            public void onFailure(Call<List<ShareDoctorResponse>> call, Throwable t) {

                Toast.makeText(context, t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });



    }


    @Override
    public int getItemCount() {
        return verifiedList.size();
    }
}
