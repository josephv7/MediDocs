package org.blockchain.medical.finalandroid;

import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;

import java.util.List;

public class VerifiedAdapter extends RecyclerView.Adapter<VerifiedAdapter.MyViewHolder> {

    private List<Verified> verifiedList;
    String valsplit,docsplit,str2,str1;
    String[] splitval,splitdoc;


    public class MyViewHolder extends RecyclerView.ViewHolder {
        public TextView classs, recordId, owner,valuev,doctorId;
        public Button bt1;

        public MyViewHolder(View view) {
            super(view);
            classs = (TextView) view.findViewById(R.id.classs);
            recordId = (TextView) view.findViewById(R.id.recordId);
            owner = (TextView) view.findViewById(R.id.owner);
            valuev = (TextView) view.findViewById(R.id.valuev);
            doctorId = (TextView) view.findViewById(R.id.doctorId);
            bt1 = view.findViewById(R.id.bt1);
        }
    }


    public VerifiedAdapter(List<Verified> verifiedList) {
        this.verifiedList = verifiedList;
    }

    @Override
    public MyViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View itemView = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.row_layout, parent, false);

        return new MyViewHolder(itemView);
    }

    @Override
    public void onBindViewHolder(MyViewHolder holder, int position) {
        Verified verified = verifiedList.get(position);
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


    }

    @Override
    public int getItemCount() {
        return verifiedList.size();
    }
}
