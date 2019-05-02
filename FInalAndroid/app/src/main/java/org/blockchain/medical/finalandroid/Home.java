package org.blockchain.medical.finalandroid;

import android.content.Intent;
import android.content.SharedPreferences;
import android.support.design.widget.FloatingActionButton;
import android.support.v4.widget.SwipeRefreshLayout;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class Home extends AppCompatActivity {

    FloatingActionButton logOut;
    FloatingActionButton viewRecord;
    TextView userName;
    TextView userId;
    String count;
    TextView count1,count2;
    SwipeRefreshLayout pullToRefresh;

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        int id = item.getItemId();
        if (id == R.id.action_logout) {
            SharedPreferences pref = getApplicationContext().getSharedPreferences("MyPref", 0);
            SharedPreferences.Editor editor = pref.edit();
            editor.putBoolean("loggedin", false);
            editor.remove("name");
            editor.remove("contentkey");
            editor.commit();

            Intent loginIntent = new Intent(Home.this,Login.class);
            startActivity(loginIntent);
            finish();
            return true;
        }
        return super.onOptionsItemSelected(item);
    }


    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        MenuInflater inflater = getMenuInflater();
        inflater.inflate(R.menu.menu_main, menu);
        return super.onCreateOptionsMenu(menu);
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home);

        SharedPreferences pref = getApplicationContext().getSharedPreferences("MyPref", 0);


        logOut = findViewById(R.id.logOut);
        viewRecord = findViewById(R.id.viewRecord);
        userName = findViewById(R.id.userName);
        userId = findViewById(R.id.userId);
        count1 = findViewById(R.id.count1);
        count2 = findViewById(R.id.count2);
        pullToRefresh = findViewById(R.id.pullToRefresh);

        userName.setText(pref.getString("patientName","Patient One"));
        userId.setText(pref.getString("name","2001"));

        getCount();

        logOut.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                SharedPreferences pref = getApplicationContext().getSharedPreferences("MyPref", 0);
                SharedPreferences.Editor editor = pref.edit();
                editor.putBoolean("loggedin", false);
                editor.remove("name");
                editor.remove("contentkey");
                editor.commit();

                Intent loginIntent = new Intent(Home.this,Login.class);
                startActivity(loginIntent);
                finish();


            }
        });

        viewRecord.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {


                Intent viewIntent = new Intent(Home.this,ViewRecord.class);
                startActivity(viewIntent);

            }
        });

        pullToRefresh.setOnRefreshListener(new SwipeRefreshLayout.OnRefreshListener() {
            @Override
            public void onRefresh() {

                getCount();

            }
        });
    }

    private void getCount() {

        SharedPreferences pref = getApplicationContext().getSharedPreferences("MyPref", 0);


        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl(Api.BASE_URL)
                .addConverterFactory(GsonConverterFactory.create()) //Here we are using the GsonConverterFactory to directly convert json data to object
                .build();

        Api api = retrofit.create(Api.class);

        Call<List<CountResponse>> call = api.getCount(pref.getString("name","2001") , "verified");

        call.enqueue(new Callback<List<CountResponse>>() {
            @Override
            public void onResponse(Call<List<CountResponse>> call, Response<List<CountResponse>> response) {

                List<CountResponse> docs = response.body();

                count = docs.get(0).count;
                count1.setText(count);

                getCount1();



            }

            @Override
            public void onFailure(Call<List<CountResponse>> call, Throwable t) {

                Toast.makeText(getApplicationContext(), t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });



    }

    private void getCount1() {

        SharedPreferences pref = getApplicationContext().getSharedPreferences("MyPref", 0);


        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl(Api.BASE_URL)
                .addConverterFactory(GsonConverterFactory.create()) //Here we are using the GsonConverterFactory to directly convert json data to object
                .build();

        Api api = retrofit.create(Api.class);

        Call<List<CountResponse>> call = api.getCount(pref.getString("name","2001") , "unverified");

        call.enqueue(new Callback<List<CountResponse>>() {
            @Override
            public void onResponse(Call<List<CountResponse>> call, Response<List<CountResponse>> response) {

                pullToRefresh.setRefreshing(false);

                List<CountResponse> docs = response.body();

                count = docs.get(0).count;
                count2.setText(count);


            }

            @Override
            public void onFailure(Call<List<CountResponse>> call, Throwable t) {

                Toast.makeText(getApplicationContext(), t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });


    }
}
