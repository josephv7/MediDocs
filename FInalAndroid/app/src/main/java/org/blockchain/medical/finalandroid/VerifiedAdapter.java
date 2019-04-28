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

    ProgressBar pd;



    public class MyViewHolder extends RecyclerView.ViewHolder {
        public TextView classs, recordId, owner,valuev,doctorId;
        public Button bt1,bt2;

        public MyViewHolder(View view) {
            super(view);
            classs = (TextView) view.findViewById(R.id.classs);
            recordId = (TextView) view.findViewById(R.id.recordId);
            owner = (TextView) view.findViewById(R.id.owner);
            valuev = (TextView) view.findViewById(R.id.valuev);
            doctorId = (TextView) view.findViewById(R.id.doctorId);
            bt1 = view.findViewById(R.id.bt1);
            bt2 = view.findViewById(R.id.bt2);
            pd = view.findViewById(R.id.pd);

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
    public void onBindViewHolder(MyViewHolder holder, int position) {
        final Verified verified = verifiedList.get(position);
        str1 = "";
        str2 = "";

        valsplit = verified.getValuev().substring(1,verified.getValuev().length()-1);
        splitval = valsplit.split(",");

        docsplit = verified.getDoctorId().substring(1,verified.getDoctorId().length()-1);
        splitdoc = docsplit.split(",");


        holder.classs.setText(" : "+verified.getClasss());
        holder.recordId.setText(" : "+verified.getRecordId());
        holder.owner.setText(" : "+verified.getOwner());
        for (int i =0; i < splitval.length-1;i++) {

            str1 = str1 + splitval[i] + "\n  ";
        }

        for (int i =splitval.length-1; i < splitval.length;i++) {

            str1 = str1 + splitval[i];
        }

        holder.valuev.setText(" : " + str1);

        for (int i =0; i < splitdoc.length-1;i++) {

            str2 = str2 + splitdoc[i] + "\n  ";

        }

        for (int i =splitdoc.length-1; i < splitdoc.length;i++) {

            str2 = str2 + splitdoc[i];
        }
        holder.doctorId.setText(" : "+str2);

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

                    // setup the alert builder
                    selectedItems = new ArrayList();


                    AlertDialog.Builder builder = new AlertDialog.Builder(context);
                    builder.setTitle("Doctors List");

                    // add a checkbox list
                    final String[] doctors = {"doctor 1", "doctor 2", "doctor 3", "doctor 4", "doctor 5"};
                    boolean[] checkedItems = {false, false, false, false, false};
                    builder.setMultiChoiceItems(doctors, checkedItems, new DialogInterface.OnMultiChoiceClickListener() {
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

                            for (int i = 0; i < selectedItems.size();i++){

                                Log.d("userselected",doctors[(int) selectedItems.get(i)]);

                          }
                        }
                    });
                    builder.setNegativeButton("Cancel", null);

// create and show the alert dialog
                    AlertDialog dialog = builder.create();
                    dialog.show();
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
                                    pd.setVisibility(View.VISIBLE);
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

                                    pd.setVisibility(View.INVISIBLE);

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


    @Override
    public int getItemCount() {
        return verifiedList.size();
    }
}
