package com.remobile.umeng;

import android.app.AlertDialog;
import android.content.Context;
import android.graphics.Color;
import android.os.Bundle;
import android.view.Gravity;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;

/**
 * Created by ghg on 16/10/20.
 */
public class ShareProgressDialog extends AlertDialog {
    private Context mContext;

    public ShareProgressDialog(Context context) {
        super(context);
        this.mContext = context;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        LinearLayout.LayoutParams linearLayout = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        LinearLayout layout = new LinearLayout(mContext);
        layout.setLayoutParams(linearLayout);
        layout.setGravity(Gravity.CENTER);
        layout.setPadding(35, 20, 35, 20);
        layout.setBackgroundColor(Color.TRANSPARENT);
        layout.setOrientation(LinearLayout.VERTICAL);
        ProgressBar ProgressBar = new ProgressBar(mContext);
        layout.addView(ProgressBar);
        TextView textView = new TextView(mContext);
//        textView.setText("请稍后...");
        textView.setTextColor(Color.WHITE);
        layout.addView(textView);
        setContentView(layout);
    }
}