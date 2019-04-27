package org.blockchain.medical.finalandroid;

import android.content.Context;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v7.widget.DefaultItemAnimator;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
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


public class UnverifiedFragment extends Fragment {
    // Store instance variables
//    private String title;
//    private int page;

    String classs , recordId ,owner ,verified1;
    String[] value , doctorId;
    int j;



    private List<Verified> unverifiedList = new ArrayList<>();
    private RecyclerView recyclerView;
    private VerifiedAdapter mAdapter;

    ProgressBar pd;

    // newInstance constructor for creating fragment with arguments
    public static UnverifiedFragment newInstance(int page, String title) {
        UnverifiedFragment fragmentFirst = new UnverifiedFragment();
//        Bundle args = new Bundle();
//        args.putInt("someInt", page);
//        args.putString("someTitle", title);
//        fragmentFirst.setArguments(args);
        return fragmentFirst;
    }

    // Store instance variables based on arguments passed
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
//        page = getArguments().getInt("someInt", 0);
//        title = getArguments().getString("someTitle");
    }

    // Inflate the view for the fragment based on layout XML
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_verified, container, false);
//        TextView tvLabel = (TextView) view.findViewById(R.id.tvLabel);
//        tvLabel.setText(page + " -- " + title);

        recyclerView = (RecyclerView)view.findViewById(R.id.recycler_view);

        pd = view.findViewById(R.id.pd);

        mAdapter = new VerifiedAdapter(unverifiedList);
        RecyclerView.LayoutManager mLayoutManager = new LinearLayoutManager(this.getActivity());
        recyclerView.setLayoutManager(mLayoutManager);
        recyclerView.setItemAnimator(new DefaultItemAnimator());
        recyclerView.setAdapter(mAdapter);

        getData();


//        TextView tvLabel = (TextView) view.findViewById(R.id.tvLabel);
//        tvLabel.setText(page + " -- " + title);

        return view;
    }

    private void getData() {

        getRecord();

    }

    void getRecord(){

        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl(Api.BASE_URL)
                .addConverterFactory(GsonConverterFactory.create()) //Here we are using the GsonConverterFactory to directly convert json data to object
                .build();

        Api api = retrofit.create(Api.class);


        SharedPreferences pref = getActivity().getSharedPreferences("MyPref", 0);

        Call<List<RecordResponse>> call = api.getRecord(pref.getString("name","2001"),"unverified");

        call.enqueue(new Callback<List<RecordResponse>>() {
            @Override
            public void onResponse(Call<List<RecordResponse>> call, Response<List<RecordResponse>> response) {

                List<RecordResponse> docs = response.body();
                //Log.d("qweerty",docs.get(0).owner);

                pd.setVisibility(View.INVISIBLE);

                for (j =0 ; j < response.body().size() ; j++){
                    classs = docs.get(j).classs;
                    recordId = docs.get(j).recordId;
                    owner = docs.get(j).owner;
                    value = docs.get(j).value;
                    doctorId = docs.get(j).doctorId;
                    verified1 = docs.get(j).verified;

                    Log.d("qweee",classs);

                    if (verified1.equals("false")){


                        Verified verified = new Verified(classs,recordId,owner,value,doctorId,verified1);
                        unverifiedList.add(verified);

                        mAdapter.notifyDataSetChanged();




                    }
                }




            }

            @Override
            public void onFailure(Call<List<RecordResponse>> call, Throwable t) {

                Toast.makeText(getActivity(), t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });





    }
}
