package com.example.service;

import cn.hutool.core.date.DateTime;
import cn.hutool.core.date.DateUnit;
import com.example.entity.Notice;
import com.example.mapper.NoticeMapper;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class NoticeService {
    @Resource
    private NoticeMapper noticeMapper;

    public void add(Notice notice) {
        notice.setTime(String.valueOf(DateTime.now())); // 获取当前时间
        noticeMapper.insert(notice);
    }

    /**
     * 查询所有
     *
     * @return
     */
    public List<Notice> selectAll(Notice notice) {
        List<Notice> list = noticeMapper.selectAll(notice);
        return list;
    }

    /**
     * 分页查询
     *
     * @param notice
     * @param pageNum
     * @param pageSize
     * @return
     */
    public PageInfo<Notice> selectPage(Notice notice, Integer pageNum, Integer pageSize) {
        PageHelper.startPage(pageNum, pageSize);
        List<Notice> list = noticeMapper.selectAll(notice);
        return PageInfo.of(list);
    }

}
